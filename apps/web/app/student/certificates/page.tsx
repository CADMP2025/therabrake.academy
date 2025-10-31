import { createClient } from '@/lib/supabase/server'
import CertificateCard from '@/components/student/certificates/CertificateCard'
import EmptyState from '@/components/student/certificates/EmptyState'

export const dynamic = 'force-dynamic'

export default async function CertificatesWalletPage() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const userId = auth.user?.id
  if (!userId) return <div className="p-6">Please sign in to view your certificates.</div>

  const { data: certs } = await supabase
    .from('certificates')
    .select('id, certificate_number, ce_hours, issued_at, expires_at, pdf_url, verification_code, courses(title)')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })

  // Get course progress for empty state
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      course_id,
      progress,
      status,
      quiz_score,
      courses(title, ce_hours)
    `)
    .eq('user_id', userId)
    .in('status', ['active', 'completed'])

  const courseProgress = (enrollments || []).map((e: any) => ({
    course_id: e.course_id,
    course_title: e.courses?.title || 'Untitled Course',
    ce_hours: Number(e.courses?.ce_hours || 0),
    progress: Number(e.progress || 0),
    status: e.status,
    quiz_score: e.quiz_score,
    quiz_passed: e.quiz_score !== null && e.quiz_score >= 70,
  }))

  const inProgressCount = courseProgress.filter(c => c.status === 'active').length
  const completedCount = courseProgress.filter(c => c.status === 'completed').length
  const totalCEHours = (certs || []).reduce((sum: number, cert: any) => sum + Number(cert.ce_hours || 0), 0)

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">My Certificates</h1>
      {(!certs || certs.length === 0) ? (
        <EmptyState 
          inProgressCount={inProgressCount}
          completedCount={completedCount}
          totalCEHours={totalCEHours}
          courseProgress={courseProgress}
        />
      ) : (
        <div className="grid gap-4">
          {certs.map((c: any) => (
            <CertificateCard
              key={c.id}
              cert={{
                id: c.id,
                certificate_number: c.certificate_number,
                ce_hours: Number(c.ce_hours || 0),
                issued_at: c.issued_at,
                expires_at: c.expires_at,
                pdf_url: c.pdf_url,
                verification_code: c.verification_code,
                course_title: c.courses?.title,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
