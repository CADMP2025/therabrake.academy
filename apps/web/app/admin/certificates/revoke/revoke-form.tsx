"use client"

import { useState } from 'react'

export default function RevokeForm() {
  const [certificateNumber, setCertificateNumber] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [message, setMessage] = useState<string>('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/certificates/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateNumber, reason }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('success')
        setMessage('Certificate revoked successfully.')
        setCertificateNumber('')
        setReason('')
      } else {
        setStatus('error')
        setMessage(json?.error || 'Failed to revoke certificate.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Certificate Number</label>
        <input
          type="text"
          required
          value={certificateNumber}
          onChange={(e) => setCertificateNumber(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="e.g., TXLPC-2025-000123"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
          placeholder="Provide a short reason (fraudulent, duplicate issuance, etc.)"
          rows={3}
        />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status==='loading'} className="btn-primary">
          {status==='loading' ? 'Revoking…' : 'Revoke'}
        </button>
        {status==='success' && <span className="text-emerald-600 text-sm">{message}</span>}
        {status==='error' && <span className="text-red-600 text-sm">{message}</span>}
      </div>
    </form>
  )
}
