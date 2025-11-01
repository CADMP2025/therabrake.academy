# Offline Download Manager - Implementation Guide

**Created:** October 31, 2025  
**Target Platform:** Web (PWA) and Mobile (React Native/Expo)  
**Estimated Implementation Time:** 40-60 hours

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technical Requirements](#technical-requirements)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Implementation Phases](#implementation-phases)
6. [Web Implementation](#web-implementation)
7. [Mobile Implementation](#mobile-implementation)
8. [Testing Strategy](#testing-strategy)

---

## Overview

The Offline Download Manager enables students to download course content (videos, PDFs, quizzes) for offline access, with intelligent queue management, storage optimization, and automatic synchronization.

### Key Features

- **Priority Queue System:** User-controlled download priorities
- **Background Downloads:** Non-blocking downloads with pause/resume
- **Smart Storage Management:** Auto-cleanup, size estimation, quality selection
- **Offline Sync:** Local storage with conflict resolution
- **Access Control:** Enrollment validation and expiration handling

---

## Technical Requirements

### 1. NPM Packages & Dependencies

#### Web Platform (PWA)

```bash
cd apps/web
npm install --save \
  idb \                           # IndexedDB wrapper (5KB)
  workbox-webpack-plugin \        # Service Worker toolkit
  workbox-strategies \            # Caching strategies
  workbox-expiration \            # Cache expiration
  workbox-background-sync \       # Background sync
  workbox-precaching \            # Asset precaching
  @types/dom-storage \            # TypeScript types
  comlink                         # Web Worker communication (11KB)

# Optional but recommended
npm install --save-dev \
  workbox-cli                     # CLI for generating SW
```

**Total Bundle Impact:** ~30-40KB gzipped

#### Mobile Platform (Expo/React Native)

```bash
cd apps/mobile
npm install --save \
  expo-file-system \              # File system access
  expo-sqlite \                   # Local SQLite database
  @react-native-async-storage/async-storage \ # Key-value storage
  react-native-background-fetch \ # Background downloads
  react-native-fs \               # Advanced file operations (alternative)
  @tanstack/react-query \         # Data fetching & caching
  zustand \                       # State management (3KB)
  date-fns                        # Date utilities (minimal)
```

**Total Bundle Impact:** ~100-150KB

---

### 2. Browser APIs (Web)

- **IndexedDB:** Primary offline database (unlimited storage)
- **Service Workers:** Background downloads and caching
- **Cache API:** HTTP response caching
- **Background Sync API:** Sync when connectivity restored
- **Storage Manager API:** Check available storage
- **Web Workers:** Heavy computation off main thread

### 3. Native APIs (Mobile)

- **Expo FileSystem:** File download/storage
- **SQLite:** Structured data storage
- **Background Fetch:** iOS/Android background downloads
- **NetInfo:** Network status monitoring
- **Notifications:** Download completion alerts

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
│  (Download Manager UI, Progress Indicators, Settings)       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 Download Orchestrator                        │
│  - Queue Management                                          │
│  - Priority Scheduling                                       │
│  - Pause/Resume Logic                                        │
└────────┬──────────────────────┬──────────────────────────────┘
         │                      │
┌────────▼──────────┐  ┌───────▼───────────┐
│  Storage Manager  │  │  Sync Manager     │
│  - IndexedDB/     │  │  - Conflict       │
│    SQLite         │  │    Resolution     │
│  - File System    │  │  - Progress Sync  │
│  - Cache API      │  │  - Background     │
│  - Quota Mgmt     │  │    Sync           │
└────────┬──────────┘  └───────┬───────────┘
         │                      │
┌────────▼──────────────────────▼───────────────────────────┐
│              Supabase Backend                              │
│  - Video URLs (signed)                                     │
│  - Course Materials                                        │
│  - Enrollment Validation                                   │
│  - Progress Tracking                                       │
└────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### 1. Supabase Tables (Backend)

```sql
-- downloads table
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('video', 'pdf', 'quiz', 'image')),
  resource_url TEXT NOT NULL,
  file_size BIGINT, -- bytes
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  quality TEXT DEFAULT 'medium' CHECK (quality IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'downloading', 'completed', 'failed', 'paused')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- indexes
CREATE INDEX idx_downloads_user_status ON downloads(user_id, status);
CREATE INDEX idx_downloads_user_course ON downloads(user_id, course_id);
CREATE INDEX idx_downloads_expires ON downloads(expires_at) WHERE expires_at IS NOT NULL;

-- RLS policies
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own downloads"
  ON downloads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own downloads"
  ON downloads FOR ALL
  USING (auth.uid() = user_id);

-- download_queue table
CREATE TABLE download_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  download_id UUID REFERENCES downloads(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  wifi_only BOOLEAN DEFAULT true,
  auto_delete_after_watch BOOLEAN DEFAULT false,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, download_id)
);

CREATE INDEX idx_queue_user_priority ON download_queue(user_id, priority DESC, position ASC);

-- storage_usage table (for quota management)
CREATE TABLE storage_usage (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_bytes BIGINT DEFAULT 0,
  video_bytes BIGINT DEFAULT 0,
  document_bytes BIGINT DEFAULT 0,
  cache_bytes BIGINT DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- sync_log table (for conflict resolution)
CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  data JSONB,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  device_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_user_entity ON sync_log(user_id, entity_type, entity_id);
```

### 2. IndexedDB Schema (Web Client)

```typescript
// Database name: 'therabrake-offline'
// Version: 1

interface OfflineDatabase {
  // Object Store: 'downloads'
  downloads: {
    key: string; // download_id
    value: {
      id: string;
      userId: string;
      courseId: string;
      lessonId: string;
      resourceType: 'video' | 'pdf' | 'quiz' | 'image';
      resourceUrl: string;
      localPath: string; // IndexedDB blob key or file path
      fileSize: number;
      downloadedAt: Date;
      expiresAt?: Date;
      quality: 'low' | 'medium' | 'high';
      status: 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';
      progress: number; // 0-100
      errorMessage?: string;
      metadata: {
        title: string;
        thumbnail?: string;
        duration?: number; // for videos
      };
    };
    indexes: {
      'by-status': string; // status
      'by-course': string; // courseId
      'by-expires': Date; // expiresAt
    };
  };

  // Object Store: 'files'
  files: {
    key: string; // file_id (hash of URL)
    value: {
      id: string;
      blob: Blob;
      mimeType: string;
      size: number;
      createdAt: Date;
    };
  };

  // Object Store: 'queue'
  queue: {
    key: string; // queue_item_id
    value: {
      id: string;
      downloadId: string;
      priority: number; // 1-10
      wifiOnly: boolean;
      autoDeleteAfterWatch: boolean;
      position: number;
      createdAt: Date;
    };
    indexes: {
      'by-priority': number; // priority (descending)
    };
  };

  // Object Store: 'course-data'
  courseData: {
    key: string; // course_id
    value: {
      id: string;
      title: string;
      description: string;
      lessons: Array<{
        id: string;
        title: string;
        content: string;
        videoUrl?: string;
        resources: Array<{
          id: string;
          name: string;
          type: string;
          url: string;
        }>;
      }>;
      quizzes: Array<{
        id: string;
        questions: any[];
      }>;
      cachedAt: Date;
    };
  };

  // Object Store: 'progress'
  progress: {
    key: string; // `${userId}_${courseId}_${lessonId}`
    value: {
      userId: string;
      courseId: string;
      lessonId: string;
      progress: number;
      completed: boolean;
      lastPosition?: number; // for video progress
      syncedAt?: Date;
      needsSync: boolean;
    };
    indexes: {
      'by-sync': boolean; // needsSync
    };
  };

  // Object Store: 'settings'
  settings: {
    key: string;
    value: any;
  };
}
```

### 3. SQLite Schema (Mobile Client)

```sql
-- Similar to IndexedDB but in SQLite
-- Blobs stored in filesystem, references in DB

CREATE TABLE downloads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_url TEXT NOT NULL,
  local_path TEXT, -- FileSystem.documentDirectory path
  file_size INTEGER,
  downloaded_at INTEGER, -- Unix timestamp
  expires_at INTEGER,
  quality TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  error_message TEXT,
  metadata TEXT, -- JSON string
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_downloads_status ON downloads(status);
CREATE INDEX idx_downloads_course ON downloads(course_id);
CREATE INDEX idx_downloads_expires ON downloads(expires_at);

CREATE TABLE queue (
  id TEXT PRIMARY KEY,
  download_id TEXT REFERENCES downloads(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 5,
  wifi_only INTEGER DEFAULT 1,
  auto_delete_after_watch INTEGER DEFAULT 0,
  position INTEGER NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_queue_priority ON queue(priority DESC, position ASC);

CREATE TABLE course_data (
  course_id TEXT PRIMARY KEY,
  data TEXT NOT NULL, -- JSON string
  cached_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE progress (
  id TEXT PRIMARY KEY, -- userId_courseId_lessonId
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  completed INTEGER DEFAULT 0,
  last_position INTEGER,
  synced_at INTEGER,
  needs_sync INTEGER DEFAULT 1,
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_progress_sync ON progress(needs_sync) WHERE needs_sync = 1;

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1) - 12-15 hours

**Web:**
1. Set up Workbox and Service Worker
2. Create IndexedDB wrapper with `idb`
3. Implement basic download queue
4. Add Storage Manager API integration

**Mobile:**
1. Set up Expo FileSystem
2. Create SQLite database wrapper
3. Implement basic download queue
4. Configure background fetch

**Backend:**
1. Create Supabase tables (downloads, queue, storage_usage, sync_log)
2. Add RLS policies
3. Create API endpoints for download management

### Phase 2: Core Download System (Week 2) - 16-20 hours

**Web:**
1. Implement download orchestrator with Web Workers
2. Add pause/resume functionality
3. Create progress tracking
4. Implement cache strategies with Workbox

**Mobile:**
1. Implement download orchestrator
2. Add background download tasks
3. Create progress tracking
4. Handle iOS/Android differences

**Backend:**
1. Generate signed URLs for videos (Supabase Storage or R2)
2. Add enrollment validation endpoint
3. Create download authorization logic

### Phase 3: Storage Management (Week 3) - 12-15 hours

**Web & Mobile:**
1. Implement storage quota checking
2. Add auto-cleanup logic
3. Create quality selection system
4. Build storage usage dashboard
5. Add file size estimation

**Backend:**
1. Track storage usage per user
2. Add cleanup scheduled jobs
3. Implement expiration handling

### Phase 4: Sync & UI (Week 4) - 12-15 hours

**Web & Mobile:**
1. Implement offline sync strategy
2. Add conflict resolution
3. Build download manager UI
4. Create settings panel
5. Add notifications
6. Implement WiFi-only checks

**Testing:**
1. Unit tests for all components
2. Integration tests
3. Offline scenario testing
4. Performance testing

---

## Web Implementation

### 1. Service Worker Setup

**File:** `apps/web/public/sw.js`

```javascript
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache videos with CacheFirst
registerRoute(
  ({ url }) => url.pathname.includes('/videos/'),
  new CacheFirst({
    cacheName: 'videos-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Cache API responses with NetworkFirst
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
      new BackgroundSyncPlugin('api-sync-queue', {
        maxRetentionTime: 24 * 60, // 24 hours
      }),
    ],
  })
);

// Cache course materials
registerRoute(
  ({ url }) => url.pathname.match(/\.(pdf|jpg|png|svg)$/),
  new CacheFirst({
    cacheName: 'materials-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
      }),
    ],
  })
);
```

### 2. IndexedDB Wrapper

**File:** `apps/web/lib/offline/db.ts`

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDB extends DBSchema {
  downloads: {
    key: string;
    value: DownloadItem;
    indexes: { 'by-status': string; 'by-course': string };
  };
  files: {
    key: string;
    value: FileItem;
  };
  queue: {
    key: string;
    value: QueueItem;
    indexes: { 'by-priority': number };
  };
  // ... other stores
}

const DB_NAME = 'therabrake-offline';
const DB_VERSION = 1;

export async function initDB(): Promise<IDBPDatabase<OfflineDB>> {
  return openDB<OfflineDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Create downloads store
      if (!db.objectStoreNames.contains('downloads')) {
        const downloadStore = db.createObjectStore('downloads', { keyPath: 'id' });
        downloadStore.createIndex('by-status', 'status');
        downloadStore.createIndex('by-course', 'courseId');
      }

      // Create files store
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' });
      }

      // Create queue store
      if (!db.objectStoreNames.contains('queue')) {
        const queueStore = db.createObjectStore('queue', { keyPath: 'id' });
        queueStore.createIndex('by-priority', 'priority');
      }

      // ... other stores
    },
  });
}

// Helper functions
export class OfflineDBManager {
  private db: IDBPDatabase<OfflineDB> | null = null;

  async init() {
    this.db = await initDB();
  }

  async addDownload(download: DownloadItem) {
    if (!this.db) await this.init();
    return this.db!.add('downloads', download);
  }

  async getDownload(id: string) {
    if (!this.db) await this.init();
    return this.db!.get('downloads', id);
  }

  async getAllDownloads() {
    if (!this.db) await this.init();
    return this.db!.getAll('downloads');
  }

  async updateDownload(id: string, updates: Partial<DownloadItem>) {
    if (!this.db) await this.init();
    const download = await this.db!.get('downloads', id);
    if (!download) throw new Error('Download not found');
    const updated = { ...download, ...updates };
    return this.db!.put('downloads', updated);
  }

  async deleteDownload(id: string) {
    if (!this.db) await this.init();
    return this.db!.delete('downloads', id);
  }

  // ... more methods
}

export const offlineDB = new OfflineDBManager();
```

### 3. Download Orchestrator

**File:** `apps/web/lib/offline/download-orchestrator.ts`

```typescript
import { offlineDB } from './db';
import { wrap } from 'comlink';

interface DownloadConfig {
  maxConcurrent: number;
  maxRetries: number;
  chunkSize: number;
  wifiOnly: boolean;
}

export class DownloadOrchestrator {
  private config: DownloadConfig;
  private activeDownloads: Map<string, AbortController> = new Map();
  private worker: Worker;

  constructor(config: Partial<DownloadConfig> = {}) {
    this.config = {
      maxConcurrent: 3,
      maxRetries: 3,
      chunkSize: 1024 * 1024, // 1MB chunks
      wifiOnly: true,
      ...config,
    };

    // Initialize Web Worker for heavy lifting
    this.worker = new Worker(new URL('./download-worker.ts', import.meta.url));
  }

  async startDownload(downloadId: string): Promise<void> {
    const download = await offlineDB.getDownload(downloadId);
    if (!download) throw new Error('Download not found');

    // Check network conditions
    if (this.config.wifiOnly && !this.isWiFi()) {
      await offlineDB.updateDownload(downloadId, { status: 'paused' });
      return;
    }

    // Check concurrent limit
    if (this.activeDownloads.size >= this.config.maxConcurrent) {
      // Queue for later
      return;
    }

    const abortController = new AbortController();
    this.activeDownloads.set(downloadId, abortController);

    try {
      await offlineDB.updateDownload(downloadId, { status: 'downloading', progress: 0 });

      // Download with progress tracking
      const blob = await this.downloadWithProgress(
        download.resourceUrl,
        downloadId,
        abortController.signal
      );

      // Store in IndexedDB
      await offlineDB.addFile({
        id: downloadId,
        blob,
        mimeType: blob.type,
        size: blob.size,
        createdAt: new Date(),
      });

      await offlineDB.updateDownload(downloadId, {
        status: 'completed',
        progress: 100,
        downloadedAt: new Date(),
        localPath: downloadId,
      });

      // Sync to backend
      await this.syncDownloadStatus(downloadId, 'completed');
    } catch (error) {
      console.error(`Download failed for ${downloadId}:`, error);
      await offlineDB.updateDownload(downloadId, {
        status: 'failed',
        errorMessage: error.message,
      });
    } finally {
      this.activeDownloads.delete(downloadId);
      this.processQueue(); // Start next download
    }
  }

  private async downloadWithProgress(
    url: string,
    downloadId: string,
    signal: AbortSignal
  ): Promise<Blob> {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    const reader = response.body!.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      received += value.length;

      // Update progress
      const progress = total ? Math.round((received / total) * 100) : 0;
      await offlineDB.updateDownload(downloadId, { progress });
    }

    return new Blob(chunks);
  }

  async pauseDownload(downloadId: string): Promise<void> {
    const controller = this.activeDownloads.get(downloadId);
    if (controller) {
      controller.abort();
      this.activeDownloads.delete(downloadId);
    }
    await offlineDB.updateDownload(downloadId, { status: 'paused' });
  }

  async resumeDownload(downloadId: string): Promise<void> {
    await offlineDB.updateDownload(downloadId, { status: 'pending' });
    await this.startDownload(downloadId);
  }

  async cancelDownload(downloadId: string): Promise<void> {
    await this.pauseDownload(downloadId);
    await offlineDB.deleteDownload(downloadId);
    await offlineDB.deleteFile(downloadId);
  }

  private isWiFi(): boolean {
    const connection = (navigator as any).connection;
    if (!connection) return true; // Assume WiFi if API not available
    return connection.effectiveType === 'wifi' || connection.type === 'wifi';
  }

  private async processQueue(): Promise<void> {
    // Get next download from queue
    // Start if under concurrent limit
    // Implementation depends on queue logic
  }

  private async syncDownloadStatus(downloadId: string, status: string): Promise<void> {
    try {
      await fetch('/api/downloads/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ downloadId, status }),
      });
    } catch (error) {
      console.error('Failed to sync download status:', error);
      // Will retry with BackgroundSync
    }
  }
}

export const downloadOrchestrator = new DownloadOrchestrator();
```

### 4. Storage Manager

**File:** `apps/web/lib/offline/storage-manager.ts`

```typescript
export class StorageManager {
  async getStorageEstimate(): Promise<{ usage: number; quota: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0),
      };
    }
    return { usage: 0, quota: 0, available: 0 };
  }

  async checkQuota(requiredBytes: number): Promise<boolean> {
    const { available } = await this.getStorageEstimate();
    return available >= requiredBytes;
  }

  async cleanupOldDownloads(maxAge: number = 30): Promise<void> {
    const downloads = await offlineDB.getAllDownloads();
    const now = new Date();
    const maxAgeMs = maxAge * 24 * 60 * 60 * 1000;

    for (const download of downloads) {
      if (download.downloadedAt) {
        const age = now.getTime() - new Date(download.downloadedAt).getTime();
        if (age > maxAgeMs) {
          await offlineDB.deleteDownload(download.id);
          await offlineDB.deleteFile(download.id);
        }
      }
    }
  }

  async cleanupExpiredDownloads(): Promise<void> {
    const downloads = await offlineDB.getAllDownloads();
    const now = new Date();

    for (const download of downloads) {
      if (download.expiresAt && new Date(download.expiresAt) < now) {
        await offlineDB.deleteDownload(download.id);
        await offlineDB.deleteFile(download.id);
      }
    }
  }

  async estimateDownloadSize(url: string): Promise<number> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : 0;
    } catch (error) {
      console.error('Failed to estimate size:', error);
      return 0;
    }
  }

  async getUsageByType(): Promise<{ videos: number; documents: number; cache: number }> {
    const downloads = await offlineDB.getAllDownloads();
    const usage = { videos: 0, documents: 0, cache: 0 };

    for (const download of downloads) {
      if (download.status === 'completed' && download.fileSize) {
        if (download.resourceType === 'video') {
          usage.videos += download.fileSize;
        } else if (download.resourceType === 'pdf') {
          usage.documents += download.fileSize;
        } else {
          usage.cache += download.fileSize;
        }
      }
    }

    return usage;
  }
}

export const storageManager = new StorageManager();
```

---

## Mobile Implementation

### 1. Download Manager (Expo)

**File:** `apps/mobile/lib/offline/download-manager.ts`

```typescript
import * as FileSystem from 'expo-file-system';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import NetInfo from '@react-native-community/netinfo';
import { SQLiteDatabase } from './sqlite-db';

const BACKGROUND_DOWNLOAD_TASK = 'background-download-task';

// Register background task
TaskManager.defineTask(BACKGROUND_DOWNLOAD_TASK, async () => {
  try {
    const manager = new DownloadManager();
    await manager.processQueue();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background download failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export class DownloadManager {
  private db: SQLiteDatabase;
  private downloadDirectory: string;

  constructor() {
    this.db = new SQLiteDatabase();
    this.downloadDirectory = `${FileSystem.documentDirectory}downloads/`;
  }

  async init(): Promise<void> {
    await this.db.init();
    
    // Ensure download directory exists
    const dirInfo = await FileSystem.getInfoAsync(this.downloadDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.downloadDirectory, { intermediates: true });
    }

    // Register background task
    await BackgroundFetch.registerTaskAsync(BACKGROUND_DOWNLOAD_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }

  async startDownload(downloadId: string): Promise<void> {
    const download = await this.db.getDownload(downloadId);
    if (!download) throw new Error('Download not found');

    // Check network
    const netInfo = await NetInfo.fetch();
    if (download.wifiOnly && netInfo.type !== 'wifi') {
      await this.db.updateDownload(downloadId, { status: 'paused' });
      return;
    }

    const localPath = `${this.downloadDirectory}${downloadId}`;

    try {
      await this.db.updateDownload(downloadId, { status: 'downloading', progress: 0 });

      const downloadResumable = FileSystem.createDownloadResumable(
        download.resourceUrl,
        localPath,
        {},
        (downloadProgress) => {
          const progress = Math.round(
            (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
          );
          this.db.updateDownload(downloadId, { progress });
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result) {
        await this.db.updateDownload(downloadId, {
          status: 'completed',
          progress: 100,
          localPath: result.uri,
          fileSize: (await FileSystem.getInfoAsync(result.uri)).size,
          downloadedAt: Date.now(),
        });

        // Sync to backend
        await this.syncDownloadStatus(downloadId, 'completed');
      }
    } catch (error) {
      console.error(`Download failed for ${downloadId}:`, error);
      await this.db.updateDownload(downloadId, {
        status: 'failed',
        errorMessage: error.message,
      });
    }
  }

  async pauseDownload(downloadId: string): Promise<void> {
    // Expo FileSystem doesn't natively support pause/resume
    // Would need to implement chunked downloads manually
    await this.db.updateDownload(downloadId, { status: 'paused' });
  }

  async resumeDownload(downloadId: string): Promise<void> {
    await this.db.updateDownload(downloadId, { status: 'pending' });
    await this.startDownload(downloadId);
  }

  async deleteDownload(downloadId: string): Promise<void> {
    const download = await this.db.getDownload(downloadId);
    if (download && download.localPath) {
      await FileSystem.deleteAsync(download.localPath, { idempotent: true });
    }
    await this.db.deleteDownload(downloadId);
  }

  async getStorageUsage(): Promise<{ usage: number; free: number }> {
    const usage = await this.db.getTotalStorage();
    const free = await FileSystem.getFreeDiskStorageAsync();
    return { usage, free };
  }

  async cleanupOldDownloads(maxAge: number = 30): Promise<void> {
    const downloads = await this.db.getAllDownloads();
    const now = Date.now();
    const maxAgeMs = maxAge * 24 * 60 * 60 * 1000;

    for (const download of downloads) {
      if (download.downloadedAt && now - download.downloadedAt > maxAgeMs) {
        await this.deleteDownload(download.id);
      }
    }
  }

  private async processQueue(): Promise<void> {
    const queue = await this.db.getQueue();
    for (const item of queue.slice(0, 3)) { // Process top 3
      if (item.status === 'pending') {
        await this.startDownload(item.downloadId);
      }
    }
  }

  private async syncDownloadStatus(downloadId: string, status: string): Promise<void> {
    try {
      // Sync with Supabase
      const { supabase } = await import('../supabase');
      await supabase.from('downloads').update({ status }).eq('id', downloadId);
    } catch (error) {
      console.error('Failed to sync:', error);
    }
  }
}

export const downloadManager = new DownloadManager();
```

### 2. SQLite Database (Mobile)

**File:** `apps/mobile/lib/offline/sqlite-db.ts`

```typescript
import * as SQLite from 'expo-sqlite';

export class SQLiteDatabase {
  private db: SQLite.WebSQLDatabase | null = null;

  async init(): Promise<void> {
    this.db = SQLite.openDatabase('therabrake-offline.db');

    await this.execAsync(`
      CREATE TABLE IF NOT EXISTS downloads (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_url TEXT NOT NULL,
        local_path TEXT,
        file_size INTEGER,
        downloaded_at INTEGER,
        expires_at INTEGER,
        quality TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        error_message TEXT,
        metadata TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE INDEX IF NOT EXISTS idx_downloads_status ON downloads(status);
      CREATE INDEX IF NOT EXISTS idx_downloads_course ON downloads(course_id);

      CREATE TABLE IF NOT EXISTS queue (
        id TEXT PRIMARY KEY,
        download_id TEXT REFERENCES downloads(id) ON DELETE CASCADE,
        priority INTEGER DEFAULT 5,
        wifi_only INTEGER DEFAULT 1,
        auto_delete_after_watch INTEGER DEFAULT 0,
        position INTEGER NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE INDEX IF NOT EXISTS idx_queue_priority ON queue(priority DESC, position ASC);

      CREATE TABLE IF NOT EXISTS progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        lesson_id TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        completed INTEGER DEFAULT 0,
        last_position INTEGER,
        synced_at INTEGER,
        needs_sync INTEGER DEFAULT 1,
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE INDEX IF NOT EXISTS idx_progress_sync ON progress(needs_sync) WHERE needs_sync = 1;
    `);
  }

  private execAsync(sql: string, params: any[] = []): Promise<SQLite.SQLResultSet> {
    return new Promise((resolve, reject) => {
      this.db!.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getDownload(id: string): Promise<any> {
    const result = await this.execAsync('SELECT * FROM downloads WHERE id = ?', [id]);
    return result.rows.length > 0 ? result.rows.item(0) : null;
  }

  async getAllDownloads(): Promise<any[]> {
    const result = await this.execAsync('SELECT * FROM downloads ORDER BY created_at DESC');
    const downloads = [];
    for (let i = 0; i < result.rows.length; i++) {
      downloads.push(result.rows.item(i));
    }
    return downloads;
  }

  async updateDownload(id: string, updates: any): Promise<void> {
    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];
    await this.execAsync(`UPDATE downloads SET ${fields} WHERE id = ?`, values);
  }

  async deleteDownload(id: string): Promise<void> {
    await this.execAsync('DELETE FROM downloads WHERE id = ?', [id]);
  }

  async getQueue(): Promise<any[]> {
    const result = await this.execAsync(
      'SELECT * FROM queue ORDER BY priority DESC, position ASC'
    );
    const queue = [];
    for (let i = 0; i < result.rows.length; i++) {
      queue.push(result.rows.item(i));
    }
    return queue;
  }

  async getTotalStorage(): Promise<number> {
    const result = await this.execAsync('SELECT SUM(file_size) as total FROM downloads WHERE status = "completed"');
    return result.rows.item(0).total || 0;
  }

  // ... more methods
}
```

---

## Testing Strategy

### 1. Unit Tests

```typescript
// Example test for download orchestrator
describe('DownloadOrchestrator', () => {
  it('should download a file and store in IndexedDB', async () => {
    const orchestrator = new DownloadOrchestrator();
    const downloadId = 'test-download-123';
    
    await orchestrator.startDownload(downloadId);
    
    const download = await offlineDB.getDownload(downloadId);
    expect(download.status).toBe('completed');
    expect(download.progress).toBe(100);
  });

  it('should pause and resume downloads', async () => {
    const orchestrator = new DownloadOrchestrator();
    const downloadId = 'test-download-456';
    
    orchestrator.startDownload(downloadId);
    await orchestrator.pauseDownload(downloadId);
    
    const download = await offlineDB.getDownload(downloadId);
    expect(download.status).toBe('paused');
    
    await orchestrator.resumeDownload(downloadId);
    // ... assertions
  });
});
```

### 2. Integration Tests

- Test full download flow (queue → download → store → sync)
- Test offline/online transitions
- Test storage quota exceeded scenarios
- Test concurrent download limits

### 3. End-to-End Tests (Playwright/Detox)

- User downloads a course for offline viewing
- User watches offline video
- Progress syncs when back online
- Storage management UI works correctly

---

## Next Steps

1. **Review & Approve Architecture**
2. **Set up development environment** (install packages)
3. **Create Supabase migrations** (database schema)
4. **Implement Phase 1** (foundation - 12-15 hours)
5. **Test Phase 1** before moving to Phase 2

---

## Cost & Performance Estimates

### Storage Costs
- **Web:** Browser storage is free (typically 50GB+ available)
- **Mobile:** Device storage (user's device)
- **Backend:** Cloudflare R2 ~$0.015/GB/month (negligible for metadata)

### Performance Impact
- **Initial Load:** +30-50KB (web), +150KB (mobile) from libraries
- **Runtime Memory:** ~20-30MB for IndexedDB/SQLite operations
- **Battery Impact (Mobile):** Moderate during downloads, minimal when idle

### Development Time
- **Total:** 52-65 hours across 4 weeks
- **Per Platform:** ~70% shared logic, 30% platform-specific

---

**Questions or need clarification on any section?**
