/**
 * Legacy Course Importer for TheraBrake Academy
 * Imports Word documents into database
 * 
 * Usage: npx tsx scripts/import-legacy-courses.ts
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
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  console.error('\nMake sure .env.local exists in project root with:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://...');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJ...');
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
  quiz?: ParsedQuiz;
  order_index: number;
}

interface ParsedLesson {
  title: string;
  content: string;
  order_index: number;
  duration_minutes: number;
}

interface ParsedQuiz {
  title: string;
  description: string;
  questions: ParsedQuestion[];
}

interface ParsedQuestion {
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  order_index: number;
}

// Get instructor ID
async function getInstructorId(instructorEmail: string = 'instructor@therabrake.academy'): Promise<string> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', instructorEmail)
    .single();

  if (error || !profile) {
    throw new Error(
      `Instructor account not found. Please create a user with email: ${instructorEmail}\n` +
      'Go to Supabase Dashboard → Authentication → Users → Add User'
    );
  }

  return profile.id;
}

// Parse Word document
async function parseWordDocument(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// Parse content into structured modules
function parseContent(content: string): ParsedModule[] {
  const modules: ParsedModule[] = [];
  const lines = content.split('\n');
  
  let currentModule: ParsedModule | null = null;
  let currentLesson: ParsedLesson | null = null;
  let currentQuiz: ParsedQuiz | null = null;
  let contentBuffer: string[] = [];
  let questionBuffer: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Detect module headers
    const moduleMatch = line.match(/^\*{0,2}Module\s+(\d+)[:\s]+(.+?)(\*{0,2})$/i);
    if (moduleMatch) {
      // Save previous content
      if (currentLesson && currentModule) {
        currentLesson.content = contentBuffer.join('\n').trim();
        currentModule.lessons.push(currentLesson);
      }
      
      if (currentModule) {
        modules.push(currentModule);
      }
      
      // Start new module
      const moduleNumber = parseInt(moduleMatch[1]);
      const moduleTitle = moduleMatch[2].trim();
      
      currentModule = {
        title: moduleTitle,
        description: '',
        lessons: [],
        order_index: moduleNumber - 1
      };
      
      currentLesson = null;
      currentQuiz = null;
      contentBuffer = [];
      continue;
    }
    
    // Detect lesson headers
    const lessonMatch = line.match(/^\*{0,2}Lesson\s+[\d.]+[:\s]+(.+?)(\*{0,2})$/i);
    if (lessonMatch && currentModule) {
      if (currentLesson) {
        currentLesson.content = contentBuffer.join('\n').trim();
        currentModule.lessons.push(currentLesson);
      }
      
      currentLesson = {
        title: lessonMatch[1].trim(),
        content: '',
        order_index: currentModule.lessons.length,
        duration_minutes: 15
      };
      
      contentBuffer = [];
      continue;
    }
    
    // Detect quiz sections
    if (line.match(/^(Module|Quiz)\s+\d+\s+Quiz$/i) && currentModule) {
      if (currentLesson) {
        currentLesson.content = contentBuffer.join('\n').trim();
        currentModule.lessons.push(currentLesson);
        currentLesson = null;
      }
      
      currentQuiz = {
        title: `${currentModule.title} Quiz`,
        description: 'Test your knowledge of this module',
        questions: []
      };
      
      contentBuffer = [];
      continue;
    }
    
    // Detect quiz questions
    const questionMatch = line.match(/^\*{0,2}Question\s+(\d+)[:\s]+(.+?)(\*{0,2})$/i);
    if (questionMatch && currentQuiz) {
      if (questionBuffer) {
        currentQuiz.questions.push(questionBuffer);
      }
      
      questionBuffer = {
        question_text: questionMatch[2].trim(),
        options: [],
        correct_answer: '',
        explanation: '',
        order_index: parseInt(questionMatch[1]) - 1
      };
      continue;
    }
    
    // Detect answer options
    const optionMatch = line.match(/^([a-d])\)\s+(.+)$/i);
    if (optionMatch && questionBuffer) {
      questionBuffer.options.push(optionMatch[2].trim());
      continue;
    }
    
    // Detect correct answer
    const answerMatch = line.match(/^\*{0,2}Answer:\s*([a-d])\)\s*(.+?)(\*{0,2})$/i);
    if (answerMatch && questionBuffer) {
      questionBuffer.correct_answer = answerMatch[2].trim();
      continue;
    }
    
    // Detect explanation
    const explanationMatch = line.match(/^\*{0,2}Explanation:\s*(.+?)(\*{0,2})$/i);
    if (explanationMatch && questionBuffer) {
      questionBuffer.explanation = explanationMatch[1].trim();
      continue;
    }
    
    // Add to content buffer
    if (currentLesson || questionBuffer) {
      contentBuffer.push(line);
    } else if (currentModule && !currentModule.description) {
      currentModule.description += (currentModule.description ? ' ' : '') + line;
    }
  }
  
  // Save final items
  if (questionBuffer && currentQuiz) {
    currentQuiz.questions.push(questionBuffer);
  }
  
  if (currentQuiz && currentModule) {
    currentModule.quiz = currentQuiz;
  }
  
  if (currentLesson && currentModule) {
    currentLesson.content = contentBuffer.join('\n').trim();
    currentModule.lessons.push(currentLesson);
  }
  
  if (currentModule) {
    modules.push(currentModule);
  }
  
  return modules;
}

// Calculate reading time
function calculateDuration(content: string): number {
  const words = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(5, Math.ceil(words / wordsPerMinute));
}

// Import a single course
async function importCourse(metadata: CourseMetadata, instructorId: string): Promise<void> {
  const filePath = path.join(process.cwd(), 'courses', 'import', metadata.filename);
  
  console.log(`\n📚 Importing: ${metadata.title}`);
  console.log(`   File: ${metadata.filename}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`   ❌ File not found: ${filePath}`);
    return;
  }
  
  try {
    // Parse Word document
    console.log(`   📄 Parsing document...`);
    const content = await parseWordDocument(filePath);
    
    // Parse into structured content
    console.log(`   🔍 Extracting modules and lessons...`);
    const modules = parseContent(content);
    
    if (modules.length === 0) {
      console.log(`   ⚠️  No modules found, creating default module...`);
      modules.push({
        title: 'Course Content',
        description: 'Main course content',
        lessons: [{
          title: 'Course Material',
          content: content.substring(0, 5000),
          order_index: 0,
          duration_minutes: calculateDuration(content)
        }],
        order_index: 0
      });
    }
    
    console.log(`   📊 Found: ${modules.length} modules, ${modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons`);
    
    // Create course
    const { data: courseId, error: courseError } = await supabase
      .rpc('create_legacy_course', {
        p_instructor_id: instructorId,
        p_title: metadata.title,
        p_description: content.substring(0, 500),
        p_category: metadata.category,
        p_price: metadata.price,
        p_ce_hours: metadata.ce_hours,
        p_texas_approved: metadata.texas_approved,
        p_short_description: metadata.short_description
      });
    
    if (courseError) {
      console.error(`   ❌ Error creating course:`, courseError);
      return;
    }
    
    console.log(`   ✅ Course created with ID: ${courseId}`);
    
    // Import modules and lessons
    for (const module of modules) {
      const { data: moduleId, error: moduleError } = await supabase
        .rpc('create_course_module', {
          p_course_id: courseId,
          p_title: module.title,
          p_description: module.description || null,
          p_order_index: module.order_index
        });
      
      if (moduleError) {
        console.error(`      ❌ Error creating module:`, moduleError);
        continue;
      }
      
      // Create lessons
      for (const lesson of module.lessons) {
        const duration = calculateDuration(lesson.content);
        
        const { error: lessonError } = await supabase
          .rpc('create_lesson', {
            p_course_id: courseId,
            p_module_id: moduleId,
            p_title: lesson.title,
            p_content: { html: lesson.content },
            p_content_type: 'text',
            p_duration: duration * 60, // convert to seconds
            p_order_index: lesson.order_index,
            p_video_url: null
          });
        
        if (lessonError) {
          console.error(`      ❌ Error creating lesson:`, lessonError);
        }
      }
      
      console.log(`      ✅ Created module "${module.title}" with ${module.lessons.length} lessons`);
      
      // Create quiz if exists
      if (module.quiz && module.quiz.questions.length > 0) {
        const { data: quizId, error: quizError } = await supabase
          .rpc('create_legacy_quiz', {
            p_course_id: courseId,
            p_module_id: moduleId,
            p_title: module.quiz.title,
            p_description: module.quiz.description,
            p_order_index: module.lessons.length
          });
        
        if (quizError) {
          console.error(`      ❌ Error creating quiz:`, quizError);
        } else {
          // Create questions
          for (const question of module.quiz.questions) {
            const { error: questionError } = await supabase
              .rpc('create_quiz_question', {
                p_quiz_id: quizId,
                p_question_text: question.question_text,
                p_question_type: 'multiple_choice',
                p_options: question.options,
                p_correct_answer: [question.correct_answer],
                p_explanation: question.explanation,
                p_order_index: question.order_index,
                p_points: 1
              });
            
            if (questionError) {
              console.error(`      ❌ Error creating question:`, questionError);
            }
          }
          
          console.log(`      ✅ Created quiz with ${module.quiz.questions.length} questions`);
        }
      }
    }
    
    console.log(`   ✅ Successfully imported: ${metadata.title}`);
    
  } catch (error) {
    console.error(`   ❌ Error importing course:`, error);
  }
}

// Main import function
async function main() {
  console.log('🚀 TheraBrake Academy - Legacy Course Importer\n');
  console.log('='.repeat(60));
  
  // Read metadata CSV
  const metadataPath = path.join(process.cwd(), 'courses', 'metadata.csv');
  
  if (!fs.existsSync(metadataPath)) {
    console.error('❌ metadata.csv not found at:', metadataPath);
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
  
  console.log(`📊 Found ${records.length} courses to import\n`);
  console.log('='.repeat(60));
  
  // Get instructor ID
  try {
    const instructorId = await getInstructorId();
    console.log(`👤 Using instructor ID: ${instructorId}\n`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌', error);
    process.exit(1);
  }
  
  const instructorId = await getInstructorId();
  
  // Import each course
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < records.length; i++) {
    const metadata = records[i];
    console.log(`\n[${i + 1}/${records.length}] Processing: ${metadata.title}`);
    
    try {
      await importCourse(metadata, instructorId);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to import ${metadata.title}:`, error);
      errorCount++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully imported: ${successCount} courses`);
  console.log(`❌ Failed: ${errorCount} courses`);
  console.log(`📚 Total processed: ${records.length} courses`);
  console.log('='.repeat(60));
  
  // Set legacy quiz defaults
  console.log('\n🔧 Setting quiz defaults for legacy courses...');
  const { error: quizError } = await supabase.rpc('set_legacy_quiz_defaults');
  
  if (quizError) {
    console.error('❌ Error setting quiz defaults:', quizError);
  } else {
    console.log('✅ All legacy quizzes set to 80% passing, unlimited attempts');
  }
  
  console.log('\n✨ Import complete!\n');
}

// Run the import
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});