import { performance } from 'node:perf_hooks'
import fs from 'node:fs/promises'
import path from 'node:path'
import { renderCertificateToPdfBuffer } from '../lib/certificates/generators/pdf'
import { makeQrDataUrl, makeSigningHash } from '../lib/certificates/utils'

async function main() {
  const iterations = Number(process.env.ITERATIONS || 5)
  const outDir = path.join(process.cwd(), 'test-results', 'certificates')
  await fs.mkdir(outDir, { recursive: true })
  const times: number[] = []

  for (let i = 0; i < iterations; i++) {
    const t0 = performance.now()
    const certNo = `TEST-${Date.now()}-${String(i).padStart(3, '0')}`
    const code = `CODE${i}${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const url = `https://therabrake.academy/verify?cert=${certNo}&code=${code}`
    const qr = await makeQrDataUrl(url)
    const signing = makeSigningHash({ certNo, code })
    const buf = await renderCertificateToPdfBuffer({
      certificateNumber: certNo,
      verificationCode: code,
      qrDataUrl: qr,
      courseTitle: 'Load Test Course',
      ceHours: 3.5,
      userFullName: 'Load Tester',
      issuedAt: new Date(),
      expiresAt: null,
      providerNumber: 'TB-0001',
      signatureName: 'TheraBrake Academy',
      signatureTitle: 'Director of Education',
      signingHash: signing,
    })
    const file = path.join(outDir, `${certNo}.pdf`)
    await fs.writeFile(file, buf)
    const dt = performance.now() - t0
    times.push(dt)
    // eslint-disable-next-line no-console
    console.log(`Generated ${file} in ${dt.toFixed(0)} ms`)
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length
  // eslint-disable-next-line no-console
  console.log(`Avg generation time over ${iterations}: ${avg.toFixed(0)} ms`)
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
