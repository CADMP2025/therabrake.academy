import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RevokeForm from '@/app/admin/certificates/revoke/revoke-form'

export default async function RevokeCertificatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Revoke Certificate</h1>
      <p className="text-neutral-600 mb-4">Enter a certificate number and a reason to revoke. This action is logged and immediately reflected in public verification.</p>
      <RevokeForm />
    </div>
  )
}
