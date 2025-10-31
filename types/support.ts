// Types for Support System (Batch 10)

export type FaqCategory = {
  id: string
  slug: string
  name: string
  description?: string
  sort_order: number
}

export type FaqArticle = {
  id: string
  slug: string
  category_id: string | null
  question: string
  answer: string
  keywords: string[]
  is_published: boolean
  helpful_count: number
  not_helpful_count: number
  created_at: string
  updated_at: string
}

export type FaqArticleVersion = {
  id: string
  article_id: string
  version: number
  question: string
  answer: string
  change_summary?: string
  updated_by?: string | null
  created_at: string
}

export type FaqFeedback = {
  id: string
  article_id: string
  user_id?: string | null
  was_helpful: boolean
  comment?: string
  created_at: string
}

export type TutorialVideo = {
  id: string
  title: string
  description?: string
  url: string
  category?: string
  duration_seconds?: number
  is_published: boolean
  sort_order: number
}

export type SupportGuide = {
  id: string
  slug: string
  title: string
  description?: string
  steps: Array<{ title: string; body: string; image_url?: string }>
  is_published: boolean
  category?: string
}

export type KnowledgeBaseArticle = {
  id: string
  slug: string
  title: string
  body: string
  category?: string
  keywords: string[]
  is_published: boolean
}

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent'

export type SupportTicket = {
  id: string
  user_id?: string | null
  email: string
  subject: string
  body: string
  status: TicketStatus
  priority: TicketPriority
  category?: string
  created_at: string
  updated_at: string
}

export type TicketComment = {
  id: string
  ticket_id: string
  user_id?: string | null
  author_role: 'user' | 'admin'
  body: string
  created_at: string
}

export type FaqSearchResult = {
  articles: FaqArticle[]
  total: number
  page: number
  totalPages: number
}
