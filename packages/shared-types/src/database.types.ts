/**
 * This file is auto-generated from Supabase
 * Copy your existing lib/database.types.ts content here
 * Or run: npm run db:generate-types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Add your database types here
// For now, we'll use a placeholder to prevent errors
export interface Database {
  public: {
    Tables: {
      [key: string]: any
    }
    Views: {
      [key: string]: any
    }
    Functions: {
      [key: string]: any
    }
    Enums: {
      [key: string]: any
    }
  }
}
