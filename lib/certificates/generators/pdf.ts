import React from 'react'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import type { CertificateRenderData } from '../types'
import { TexasLpcCertificate } from './texasLpcTemplate'

export async function renderCertificateToPdfBuffer(data: CertificateRenderData): Promise<Buffer> {
  const doc = (React.createElement(TexasLpcCertificate, { data }) as unknown) as React.ReactElement<DocumentProps>
  const buf = await renderToBuffer(doc)
  return Buffer.from(buf)
}
