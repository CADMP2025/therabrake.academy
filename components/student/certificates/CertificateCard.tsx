"use client"
import { Award, Download, ExternalLink, Share2 } from 'lucide-react'
import Link from 'next/link'

export interface UICertificate {
  id: string
  certificate_number: string
  ce_hours: number
  issued_at: string
  expires_at: string | null
  pdf_url: string | null
  verification_code: string
  course_title?: string
}

export function CertificateCard({ cert }: { cert: UICertificate }) {
  const isExpired = cert.expires_at ? new Date(cert.expires_at) < new Date() : false
  const verifyUrl = `/verify?cert=${encodeURIComponent(cert.certificate_number)}&code=${encodeURIComponent(cert.verification_code)}`
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + verifyUrl : verifyUrl)}`

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Award className="h-4 w-4 text-amber-500" />
            <span>{cert.ce_hours.toFixed(1)} CE Hours</span>
            {isExpired ? <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">Expired</span> : null}
          </div>
          <div className="mt-1 text-lg font-semibold">{cert.course_title || 'Course'}</div>
          <div className="mt-1 font-mono text-xs text-neutral-500">{cert.certificate_number}</div>
          <div className="mt-1 text-xs text-neutral-500">Issued {new Date(cert.issued_at).toLocaleDateString()}</div>
        </div>
        <div className="flex gap-2">
          {cert.pdf_url ? (
            <a href={cert.pdf_url} target="_blank" rel="noreferrer" className="btn-ghost" title="Download PDF">
              <Download className="h-4 w-4" />
            </a>
          ) : null}
          <a href={verifyUrl} target="_blank" rel="noreferrer" className="btn-ghost" title="Verify">
            <ExternalLink className="h-4 w-4" />
          </a>
          <a href={shareUrl} target="_blank" rel="noreferrer" className="btn-ghost" title="Share to LinkedIn">
            <Share2 className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="mt-3">
        <Link href={`/student/certificates/${cert.id}`} className="text-sm text-primary hover:underline">
          View details
        </Link>
      </div>
    </div>
  )
}

export default CertificateCard
