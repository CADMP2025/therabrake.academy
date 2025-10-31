"use client"
import { useEffect, useMemo, useState, Suspense, useCallback } from 'react'
import Link from 'next/link'
import { Search, HelpCircle, Video, BookOpen, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SupportChatbot } from '@/components/support/SupportChatbot'

interface Category { id: string; slug: string; name: string; description?: string }
interface Article { id: string; slug: string; question: string; answer: string }

export default function SupportPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6">Loading support…</div>}>
      <SupportContent />
    </Suspense>
  )
}

function SupportContent() {
  const [q, setQ] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [guides, setGuides] = useState<any[]>([])

  const load = async () => {
    const [catRes, vidRes, guideRes] = await Promise.all([
      fetch('/api/support/categories'),
      fetch('/api/support/videos'),
      fetch('/api/support/guides')
    ])
    const cat = await catRes.json()
    const vid = await vidRes.json()
    const gui = await guideRes.json()
    setCategories(cat.categories || [])
    setVideos(vid.videos || [])
    setGuides(gui.guides || [])
  }

  useEffect(() => { load() }, [])

  const search = useCallback(async () => {
    const res = await fetch(`/api/support/faqs?q=${encodeURIComponent(q)}&limit=6`)
    const data = await res.json()
    setArticles(data.articles || [])
  }, [q])

  useEffect(() => {
    const id = setTimeout(search, 250)
    return () => clearTimeout(id)
  }, [search])

  const featuredFaqs = useMemo(() => articles.slice(0, 6), [articles])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-14">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Support Center</h1>
          <p className="text-blue-100 mb-6">Find answers, watch tutorials, or contact us</p>
          <div className="max-w-3xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200 w-5 h-5" />
            <Input
              placeholder="Search FAQs and guides…"
              className="pl-10 h-12"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick links */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              <CardTitle>Browse FAQs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Quick answers for common questions.</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link key={c.id} href={`#cat-${c.slug}`} className="text-blue-600 text-sm hover:underline">
                    {c.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <CardTitle>Watch Tutorials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Short videos for common tasks.</p>
              <ul className="space-y-1 text-sm list-disc ml-5">
                {videos.slice(0, 3).map((v) => (
                  <li key={v.id}><a href={v.url} target="_blank" className="text-blue-600 hover:underline">{v.title}</a></li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <CardTitle>Step-by-step Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Walkthroughs with screenshots.</p>
              <ul className="space-y-1 text-sm list-disc ml-5">
                {guides.slice(0, 3).map((g) => (
                  <li key={g.id}><Link href={`#guide-${g.slug}`} className="text-blue-600 hover:underline">{g.title}</Link></li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Featured search results */}
        {featuredFaqs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Top results</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredFaqs.map((a) => (
                <Card key={a.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Link href={`/support/faq/${a.slug}`} className="hover:underline">{a.question}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{a.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Chatbot */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Instant answers</h2>
          </div>
          <SupportChatbot />
        </div>

        {/* Contact support */}
        <Card>
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">Open a support ticket and our team will get back to you.</p>
            <Link href="/support/contact" className="inline-block">
              <Button>Contact Support</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
 
