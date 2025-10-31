import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function CertificateDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const userId = auth.user?.id
  if (!userId) return notFound()

  const { data: c } = await supabase
    .from('certificates')
    .select('id, certificate_number, ce_hours, issued_at, expires_at, pdf_url, verification_code, course_id, courses(title)')
    .eq('id', params.id)
    .eq('user_id', userId)
    .maybeSingle()
  if (!c) return notFound()

  const verifyUrl = `/verify?cert=${encodeURIComponent(c.certificate_number)}&code=${encodeURIComponent(c.verification_code)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent((process.env.NEXT_PUBLIC_SITE_URL || '') + verifyUrl)}`
  const courseTitle = Array.isArray((c as any).courses) ? (c as any).courses[0]?.title : (c as any).courses?.title

  return (
    <div className="mx-auto max-w-3xl p-6">
  <h1 className="mb-2 text-2xl font-semibold">{courseTitle || 'Course Certificate'}</h1>
      <div className="mb-4 font-mono text-sm text-neutral-600">{c.certificate_number}</div>
      <div className="grid gap-3 rounded-xl border bg-white p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-neutral-500">Issued</div>
            <div>{new Date(c.issued_at).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500">CE Hours</div>
            <div>{Number(c.ce_hours || 0).toFixed(1)}</div>
          </div>
        </div>
        <div>
          <div className="text-xs text-neutral-500">Verification Code</div>
          <div className="font-mono">{c.verification_code}</div>
        </div>
        <div className="mt-2 flex gap-2">
          {c.pdf_url ? (
            <a href={c.pdf_url} target="_blank" rel="noreferrer" className="btn-primary">Download PDF</a>
          ) : null}
          <a href={verifyUrl} target="_blank" rel="noreferrer" className="btn-ghost">Verify</a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer" className="btn-ghost">Share to LinkedIn</a>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">Request Physical Copy</h2>
        <form action="/api/certificates/request-mail" method="post" className="grid gap-3 rounded-xl border bg-white p-4">
          <input type="hidden" name="certificateId" value={c.id} />
          <div className="grid grid-cols-2 gap-3">
            <input name="name" placeholder="Full name" className="input" required />
            <input name="address1" placeholder="Address line 1" className="input" required />
            <input name="address2" placeholder="Address line 2 (optional)" className="input col-span-2" />
            <input name="city" placeholder="City" className="input" required />
            <input name="state" placeholder="State" className="input" required />
            <input name="postal" placeholder="ZIP / Postal" className="input" required />
          </div>
          <button type="submit" className="btn-outline w-fit">Request Mail Delivery</button>
          <p className="text-xs text-neutral-500">We’ll review your request and confirm by email. Mailing fees may apply.</p>
        </form>
      </div>
    </div>
  )
}
