# Offline Download Manager - Quick Start

**Read the full guide:** `OFFLINE_DOWNLOAD_MANAGER.md`

---

## TL;DR - What You Need

### 1. Install NPM Packages

#### Web Platform
```bash
cd apps/web
npm install --save idb workbox-webpack-plugin workbox-strategies workbox-expiration workbox-background-sync workbox-precaching comlink
```

#### Mobile Platform
```bash
cd apps/mobile
npm install --save expo-file-system expo-sqlite @react-native-async-storage/async-storage react-native-background-fetch zustand date-fns
```

### 2. Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- See full schema in OFFLINE_DOWNLOAD_MANAGER.md
CREATE TABLE downloads (...);
CREATE TABLE download_queue (...);
CREATE TABLE storage_usage (...);
CREATE TABLE sync_log (...);
```

### 3. Core Components to Build

**Web:**
- `lib/offline/db.ts` - IndexedDB wrapper
- `lib/offline/download-orchestrator.ts` - Download manager
- `lib/offline/storage-manager.ts` - Storage quota management
- `public/sw.js` - Service Worker

**Mobile:**
- `lib/offline/download-manager.ts` - Download manager
- `lib/offline/sqlite-db.ts` - SQLite wrapper

**Backend:**
- `app/api/downloads/route.ts` - Download endpoints
- `app/api/downloads/sync/route.ts` - Sync endpoint

### 4. Implementation Phases

1. **Week 1:** Foundation (12-15 hours) - Database setup, basic queue
2. **Week 2:** Core downloads (16-20 hours) - Orchestrator, pause/resume
3. **Week 3:** Storage management (12-15 hours) - Cleanup, quotas
4. **Week 4:** Sync & UI (12-15 hours) - Offline sync, UI components

**Total:** 52-65 hours

---

## Key Features Checklist

- [ ] Download Queue System
  - [ ] Priority queue (1-10)
  - [ ] Background downloads
  - [ ] Pause/resume capability
  - [ ] WiFi-only option
  - [ ] Status indicators

- [ ] Storage Management
  - [ ] Show storage usage
  - [ ] Clear cache function
  - [ ] Auto-delete old downloads
  - [ ] Download quality selection (low/medium/high)
  - [ ] Estimate download sizes
  - [ ] Manage expired downloads

- [ ] Offline Sync
  - [ ] Download video files
  - [ ] Download course materials (PDFs, images)
  - [ ] Cache quiz questions
  - [ ] Store progress locally
  - [ ] Sync when online
  - [ ] Handle conflicts
  - [ ] Background sync

---

## Architecture Overview

```
User → UI → Download Orchestrator → Storage Manager
                    ↓                      ↓
              IndexedDB/SQLite      File System/Cache API
                    ↓                      ↓
              Sync Manager ← → Supabase Backend
```

---

## Quick Implementation Commands

### Step 1: Install dependencies
```bash
cd apps/web && npm install idb workbox-webpack-plugin workbox-strategies comlink
cd apps/mobile && npm install expo-file-system expo-sqlite @react-native-async-storage/async-storage
```

### Step 2: Create database schema
```bash
# Copy SQL from OFFLINE_DOWNLOAD_MANAGER.md
# Run in Supabase SQL Editor
```

### Step 3: Create files from templates
```bash
# See code examples in OFFLINE_DOWNLOAD_MANAGER.md
# Copy and adapt for your needs
```

---

## Browser & Device Requirements

**Web:**
- Chrome 61+ (IndexedDB v2)
- Firefox 57+
- Safari 14+
- Edge 79+

**Mobile:**
- iOS 13+ (Expo compatibility)
- Android 7+ (API level 24)

---

## Storage Limits

**Web (Browser):**
- Chrome: ~60% of disk space
- Firefox: ~50% of disk space
- Safari: ~1GB (can request more)

**Mobile:**
- Limited by available device storage
- Recommend 5GB max for optimal UX

---

## Performance Metrics

| Metric | Target | Acceptable |
|--------|--------|------------|
| Download start | < 500ms | < 1s |
| Pause/Resume | < 200ms | < 500ms |
| Storage check | < 100ms | < 300ms |
| Queue update | < 300ms | < 1s |
| Sync latency | < 2s | < 5s |

---

## Testing Checklist

- [ ] Download single video
- [ ] Download multiple videos concurrently
- [ ] Pause and resume download
- [ ] Cancel download
- [ ] Download on WiFi only
- [ ] Handle network interruption
- [ ] Storage quota exceeded
- [ ] Expired content cleanup
- [ ] Offline playback
- [ ] Progress sync when online
- [ ] Conflict resolution

---

## Common Issues & Solutions

### Issue: "Quota exceeded"
**Solution:** Implement auto-cleanup or prompt user to free space

### Issue: Download fails silently
**Solution:** Check CORS headers on video URLs, ensure signed URLs are valid

### Issue: Progress not syncing
**Solution:** Check Background Sync API support, implement fallback polling

### Issue: iOS background downloads not working
**Solution:** Use proper background fetch configuration in app.json

---

## Next Steps

1. Read full documentation: `OFFLINE_DOWNLOAD_MANAGER.md`
2. Install required packages
3. Create database tables in Supabase
4. Implement Phase 1 (Foundation)
5. Test before proceeding to Phase 2

---

**Questions?** Refer to the main documentation or check existing implementations in similar projects.
