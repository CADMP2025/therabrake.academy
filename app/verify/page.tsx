import React from 'react'

export const dynamic = 'force-dynamic'

async function verify(cert: string, code: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/verify-certificate?cert=${encodeURIComponent(cert)}&code=${encodeURIComponent(code)}`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    try {
      const err = await res.json()
      return { valid: false, reason: err?.reason }
    } catch {
      return { valid: false }
    }
  }
  return res.json()
}

export default async function VerifyPage({ searchParams }: { searchParams: { cert?: string; code?: string } }) {
  const cert = searchParams.cert
  const code = searchParams.code

  if (!cert || !code) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Verify a Certificate</h1>
        <p className="text-neutral-600">Provide a certificate number and verification code.</p>
      </div>
    )
  }

  const data = await verify(cert, code)

  if (!data.valid) {
    const reason = (data as any).reason
    let message = 'Invalid or not found.'
    if (reason === 'Revoked') message = 'This certificate has been revoked by the issuer.'
    if (reason === 'Too many attempts, please try later') message = 'Too many verification attempts from this network. Please try again later.'
    if (reason === 'Missing parameters') message = 'Missing certificate number or verification code.'

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Certificate Verification</h1>
        <div className="p-4 rounded-lg bg-alert/10 text-alert">{message}</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Certificate is valid</h1>
      <div className="rounded-xl border p-4 space-y-3 bg-white">
        <div>
          <div className="text-sm text-neutral-500">Certificate Number</div>
          <div className="font-mono">{data.certificateNumber}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-neutral-500">Student</div>
            <div>{data.studentName}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-500">Course</div>
            <div>{data.courseTitle}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-neutral-500">Issued</div>
            <div>{new Date(data.issuedAt).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-sm text-neutral-500">Status</div>
            <div>
              {data.expired ? (
                <span className="text-amber-600">Expired</span>
              ) : (
                <span className="text-emerald-600">Active</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="text-sm text-neutral-500">CE Hours</div>
          <div>{Number(data.ceHours).toFixed(1)}</div>
        </div>
        {data.pdfUrl ? (
          <div>
            <a href={data.pdfUrl} target="_blank" rel="noreferrer" className="btn-primary inline-block">View PDF</a>
          </div>
        ) : null}
      </div>
    </div>
  )
}
