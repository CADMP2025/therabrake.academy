/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { CertificateRenderData } from '../types'

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#fff' },
  border: { border: '2pt solid #0f172a', padding: 24, height: '100%' },
  header: { textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 700 },
  subtitle: { fontSize: 12, color: '#334155', marginTop: 4 },
  section: { marginTop: 16 },
  label: { fontSize: 10, color: '#64748b' },
  value: { fontSize: 12, marginTop: 2 },
  row: { flexDirection: 'row', gap: 16 },
  col: { flexGrow: 1 },
  hr: { borderBottom: '1pt solid #e2e8f0', marginVertical: 12 },
  signatureRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 16 },
  signatureBlock: { flexGrow: 1 },
  signatureLine: { borderBottom: '1pt solid #94a3b8', width: '100%', marginTop: 24 },
  signatureName: { fontSize: 12, marginTop: 4 },
  signatureTitle: { fontSize: 10, color: '#64748b' },
  qrBlock: { width: 100, alignItems: 'center' },
  footnote: { fontSize: 9, color: '#475569', marginTop: 10 },
  mono: { fontFamily: 'Times-Roman' },
})

export function TexasLpcCertificate({ data }: { data: CertificateRenderData }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.header}>
            <Text style={styles.title}>Certificate of Completion</Text>
            <Text style={styles.subtitle}>Texas LPC Continuing Education</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Awarded to</Text>
            <Text style={styles.value}>{data.userFullName}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>For successful completion of</Text>
            <Text style={styles.value}>{data.courseTitle}</Text>
          </View>

          <View style={[styles.section, styles.row]}>
            <View style={styles.col}>
              <Text style={styles.label}>CE Hours Earned</Text>
              <Text style={styles.value}>{data.ceHours.toFixed(1)} hours</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Issued</Text>
              <Text style={styles.value}>{new Date(data.issuedAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Expires</Text>
              <Text style={styles.value}>{data.expiresAt ? new Date(data.expiresAt).toLocaleDateString() : 'N/A'}</Text>
            </View>
          </View>

          <View style={[styles.section, styles.row]}>
            <View style={styles.col}>
              <Text style={styles.label}>Certificate Number</Text>
              <Text style={[styles.value, styles.mono]}>{data.certificateNumber}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Verification Code</Text>
              <Text style={[styles.value, styles.mono]}>{data.verificationCode}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Provider Number</Text>
              <Text style={styles.value}>{data.providerNumber || '—'}</Text>
            </View>
          </View>

          <View style={[styles.section, styles.row]}>
            <View style={styles.col}>
              <Text style={styles.label}>License</Text>
              <Text style={styles.value}>
                {data.licenseNumber ? `${data.licenseNumber} (${data.licenseState || 'TX'})` : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.hr} />

          <View style={styles.signatureRow}>
            <View style={styles.signatureBlock}>
              {data.signatureImageDataUrl ? (
                <Image src={data.signatureImageDataUrl} style={{ width: 140, height: 40 }} />
              ) : (
                <View style={styles.signatureLine} />
              )}
              <Text style={styles.signatureName}>{data.signatureName}</Text>
              <Text style={styles.signatureTitle}>{data.signatureTitle}</Text>
            </View>

            <View style={styles.qrBlock}>
              <Image src={data.qrDataUrl} style={{ width: 100, height: 100 }} />
              <Text style={{ fontSize: 8, textAlign: 'center', marginTop: 4 }}>Scan to verify</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.footnote}>
              This certificate is valid for Texas Licensed Professional Counselors (LPC). Maintain for your records. The
              verification code above can be used to confirm authenticity at therabrake.academy/verify.
            </Text>
            <Text style={[styles.footnote, styles.mono]}>Signature Hash: {data.signingHash}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default TexasLpcCertificate
 
