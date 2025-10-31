"use client"
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export function SupportChatbot() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ reply: string; faqs: any[]; kb: any[] } | null>(null)

  const ask = async () => {
    if (!question.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/support/chatbot', { method: 'POST', body: JSON.stringify({ message: question }) })
      const data = await res.json()
      setResults(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask a question</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ask()}
          />
          <Button onClick={ask} disabled={loading} className="flex items-center gap-2">
            <Send className="h-4 w-4" /> Ask
          </Button>
        </div>

        {results && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">{results.reply}</p>
            {results.faqs.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">FAQs</div>
                <ul className="list-disc ml-5 space-y-1">
                  {results.faqs.map((f) => (
                    <li key={f.id}>
                      <Link href={`/support/faq/${f.slug}`} className="text-blue-600 hover:underline">
                        {f.question}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.kb.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Knowledge base</div>
                <ul className="list-disc ml-5 space-y-1">
                  {results.kb.map((a) => (
                    <li key={a.id}>
                      <Link href={`/support/kb/${a.slug}`} className="text-blue-600 hover:underline">
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
