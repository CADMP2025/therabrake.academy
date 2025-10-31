/**
 * Import Personal Development & Premium Courses
 * For TheraBrake Academy
 * 
 * Usage: npx tsx scripts/import-remaining-courses.ts
 */

// Load environment variables FIRST
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from project root
dotenv.config({ path: join(__dirname, '..', '.env.local') });

import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

console.log('✓ Environment variables loaded');
console.log('✓ Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

// Types
interface CourseMetadata {
  filename: string;
  title: string;
  instructor: string;
  price: number;
  category: string;
  ce_hours: number;
  texas_approved: boolean;
  short_description: string;
}

interface ParsedModule {
  title: string;
  description: string;
  lessons: ParsedLesson[];
  order_index: number;
}

interface ParsedLesson {
  title: string;
  content: string;
  order_index: number;
  duration_minutes: number;
}

// Get instructor ID
async function getInstructorId(instructorEmail: string = 'instructor@therabrake.academy'): Promise<string> {
  console.log(`\n🔍 Looking for instructor: ${instructorEmail}`);
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, role, full_name')
    .eq('email', instructorEmail)
    .single();

  if (error || !profile) {
    // Try to get any instructor
    const { data: anyInstructor } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('role', 'instructor')
      .limit(1)
      .single();
    
    if (anyInstructor) {
      console.log(`✅ Using instructor: ${anyInstructor.full_name} (${anyInstructor.email})`);
      return anyInstructor.id;
    }
    
    throw new Error('No instructor account found. Please create one first.');
  }

  console.log('✅ Found instructor:', profile.full_name);
  return profile.id;
}

// Parse Word document
async function parseWordDocument(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// Parse content into structured modules
function parseContent(content: string, courseTitle: string): ParsedModule[] {
  const modules: ParsedModule[] = [];
  const lines = content.split('\n');
  
  let currentModule: ParsedModule | null = null;
  let currentLesson: ParsedLesson | null = null;
  let contentBuffer: string[] = [];
  
  // Detect course type for better parsing
  const isPremiumCourse = courseTitle.includes('So What Mindset') || courseTitle.includes('Leap & Launch');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Detect module headers - more flexible patterns
    const isModuleHeader = 
      /^\*{0,2}Module\s+(\d+)[:\s]+(.+?)(\*{0,2})$/i.test(line) ||
      /^\*{0,2}(PILLAR|PHASE|CHAPTER|SECTION|WEEK|PART)\s+(\d+)[:\s]+(.+?)(\*{0,2})$/i.test(line) ||
      /^(PILLAR|PHASE|CHAPTER|SECTION|WEEK|PART)\s+(\d+):/i.test(line);
    
    if (isModuleHeader) {
      // Save previous content
      if (currentLesson && currentModule) {
        currentLesson.content = contentBuffer.join('\n').trim();
        currentModule.lessons.push(currentLesson);
      }
      
      if (currentModule) {
        modules.push(currentModule);
      }
      
      // Extract module title
      let moduleTitle = line;
      const moduleMatch = line.match(/^\*{0,2}(Module|PILLAR|PHASE|CHAPTER|SECTION|WEEK|PART)\s+(\d+)[:\s]+(.+?)(\*{0,2})$/i);
      if (moduleMatch) {
        moduleTitle = moduleMatch[3].trim();
      }
      
      // Start new module
      currentModule = {
        title: moduleTitle,
        description: '',
        lessons: [],
        order_index: modules.length
      };
      
      currentLesson = null;
      contentBuffer = [];
      continue;
    }
    
    // Detect lesson headers - more flexible
    const isLessonHeader = 
      /^\*{0,2}Lesson\s+[\d.]+[:\s]+(.+?)(\*{0,2})$/i.test(line) ||
      /^\*{0,2}(DAY|STEP|TOPIC|SESSION)\s+(\d+)[:\s]+(.+?)(\*{0,2})$/i.test(line) ||
      /^(DAY|STEP|TOPIC|SESSION)\s+(\d+):/i.test(line);
    
    if (isLessonHeader && currentModule) {
      if (currentLesson) {
        currentLesson.content = contentBuffer.join('\n').trim();
        currentModule.lessons.push(currentLesson);
      }
      
      // Extract lesson title
      let lessonTitle = line;
      const lessonMatch = line.match(/^\*{0,2}(Lesson|DAY|STEP|TOPIC|SESSION)\s+[\d.]+[:\s]+(.+?)(\*{0,2})$/i);
      if (lessonMatch) {
        lessonTitle = lessonMatch[2].trim();
      }
      
      currentLesson = {
        title: lessonTitle,
        content: '',
        order_index: currentModule.lessons.length,
        duration_minutes: 15
      };
      
      contentBuffer = [];
      continue;
    }
    
    // Add to content buffer
    if (currentLesson || currentModule) {
      contentBuffer.push(line);
    }
  }
  
  // Save final items
  if (currentLesson && currentModule) {
    currentLesson.content = contentBuffer.join('\n').trim();
    currentModule.lessons.push(currentLesson);
  }
  
  if (currentModule) {
    modules.push(currentModule);
  }
  
  // If no structure detected, create default module
  if (modules.length === 0 && content.trim()) {
    console.log('   ⚠️  No module structure detected, creating default layout...');
    
    // Split content into chunks of ~5000 characters
    const chunks = [];
    let currentChunk = '';
    const contentLines = content.split('\n');
    
    for (const line of contentLines) {
      if (currentChunk.length + line.length > 5000 && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = line;
      } else {
        currentChunk += (currentChunk ? '\n' : '') + line;
      }
    }
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    // Create modules from chunks
    for (let i = 0; i < chunks.length; i++) {
      modules.push({
        title: `Module ${i + 1}`,
        description: `Course content section ${i + 1}`,
        lessons: [{
          title: `Lesson ${i + 1}`,
          content: chunks[i],
          order_index: 0,
          duration_minutes: calculateDuration(chunks[i])
        }],
        order_index: i
      });
    }
  }
  
  return modules;
}

// Calculate reading time
function calculateDuration(content: string): number {
  const words = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(5, Math.ceil(words / wordsPerMinute));
}

// Create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Import a single course
async function importCourse(metadata: CourseMetadata, instructorId: string): Promise<void> {
  const filePath = path.join(process.cwd(), 'courses', 'import', metadata.filename);
  
  console.log(`\n📚 Importing: ${metadata.title}`);
  console.log(`   Category: ${metadata.category}`);
  console.log(`   Price: $${metadata.price}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`   ❌ File not found: ${filePath}`);
    return;
  }
  
  try {
    // Check if course already exists
    const slug = createSlug(metadata.title);
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id, title')
      .eq('slug', slug)
      .single();
    
    if (existingCourse) {
      console.log(`   ⚠️  Course already exists: ${existingCourse.title}`);
      console.log(`   Skipping import...`);
      return;
    }
    
    // Parse Word document
    console.log(`   📄 Parsing document...`);
    const content = await parseWordDocument(filePath);
    
    // Parse into structured content
    console.log(`   🔍 Extracting modules and lessons...`);
    const modules = parseContent(content, metadata.title);
    
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    console.log(`   📊 Found: ${modules.length} modules, ${totalLessons} lessons`);
    
    // Calculate total duration
    const totalDuration = modules.reduce((sum, m) => 
      sum + m.lessons.reduce((lSum, l) => lSum + l.duration_minutes, 0), 0
    );
    
    // Create course directly in database
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        instructor_id: instructorId,
        title: metadata.title,
        slug: slug,
        description: metadata.short_description,
        short_description: metadata.short_description,
        category: metadata.category,
        price: metadata.price,
        ce_hours: metadata.ce_hours,
        ce_approved_states: metadata.texas_approved ? ['TX'] : [],
        status: 'published',
        featured: metadata.category === 'Premium Programs',
        difficulty_level: 'intermediate',
        language: 'en',
        estimated_duration: totalDuration,
        tags: [metadata.category]
      })
      .select()
      .single();
    
    if (courseError) {
      console.error(`   ❌ Error creating course:`, courseError.message);
      return;
    }
    
    console.log(`   ✅ Course created with ID: ${course.id}`);
    
    // Import modules and lessons
    for (const module of modules) {
      const { data: moduleData, error: moduleError } = await supabase
        .from('course_modules')
        .insert({
          course_id: course.id,
          title: module.title,
          description: module.description || `Content for ${module.title}`,
          order_index: module.order_index,
          is_preview: module.order_index === 0
        })
        .select()
        .single();
      
      if (moduleError) {
        console.error(`      ❌ Error creating module:`, moduleError.message);
        continue;
      }
      
      // Create lessons
      for (const lesson of module.lessons) {
        const duration = calculateDuration(lesson.content);
        
        const { error: lessonError } = await supabase
          .from('lessons')
          .insert({
            course_id: course.id,
            module_id: moduleData.id,
            title: lesson.title,
            content_type: 'text',
            content: { 
              html: `<p>${lesson.content.replace(/\n/g, '</p><p>')}</p>`,
              raw: lesson.content 
            },
            duration: duration * 60, // convert to seconds
            order_index: lesson.order_index,
            is_free: module.order_index === 0 && lesson.order_index === 0
          });
        
        if (lessonError) {
          console.error(`      ❌ Error creating lesson:`, lessonError.message);
        }
      }
      
      console.log(`      ✅ Module "${module.title}" with ${module.lessons.length} lessons`);
    }
    
    console.log(`   ✅ Successfully imported: ${metadata.title}`);
    
  } catch (error: any) {
    console.error(`   ❌ Error importing course:`, error.message);
  }
}

// Main import function
async function main() {
  console.log('🚀 TheraBrake Academy - Personal Development & Premium Course Import\n');
  console.log('='.repeat(70));
  
  // Read metadata CSV
  const metadataPath = path.join(process.cwd(), 'courses', 'metadata.csv');
  
  if (!fs.existsSync(metadataPath)) {
    console.error('❌ metadata.csv not found at:', metadataPath);
    console.error('   Expected location: courses/metadata.csv');
    process.exit(1);
  }
  
  const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
  
  const records = parse(metadataContent, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (context.column === 'price' || context.column === 'ce_hours') {
        return parseFloat(value);
      }
      if (context.column === 'texas_approved') {
        return value.toLowerCase() === 'true';
      }
      return value;
    }
  }) as CourseMetadata[];
  
  console.log(`📊 Found ${records.length} courses to import:`);
  records.forEach(r => console.log(`   - ${r.title} ($${r.price})`));
  console.log('\n' + '='.repeat(70));
  
  // Get instructor ID
  let instructorId: string;
  try {
    instructorId = await getInstructorId();
    console.log(`👤 Using instructor ID: ${instructorId}\n`);
    console.log('='.repeat(70));
  } catch (error: any) {
    console.error('❌', error.message);
    process.exit(1);
  }
  
  // Import each course
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < records.length; i++) {
    const metadata = records[i];
    console.log(`\n[${i + 1}/${records.length}] Processing: ${metadata.title}`);
    
    try {
      await importCourse(metadata, instructorId);
      successCount++;
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        skipCount++;
      } else {
        console.error(`❌ Failed to import ${metadata.title}:`, error.message);
        errorCount++;
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Successfully imported: ${successCount} courses`);
  console.log(`⏭️  Skipped (already exist): ${skipCount} courses`);
  console.log(`❌ Failed: ${errorCount} courses`);
  console.log(`📚 Total processed: ${records.length} courses`);
  console.log('='.repeat(70));
  
  console.log('\n✨ Import complete!\n');
  console.log('📋 Next steps:');
  console.log('   1. Check your Supabase dashboard to verify courses');
  console.log('   2. Add course thumbnail images');
  console.log('   3. Review and enhance course descriptions');
  console.log('   4. Test course enrollment flow');
  console.log('   5. Configure Stripe products for these courses');
}

// Run the import
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
