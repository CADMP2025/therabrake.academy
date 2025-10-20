import { Metadata } from 'next'
import AffiliateLinksManager from '@/components/instructor/AffiliateLinksManager'

export const metadata: Metadata = {
  title: 'Affiliate Links | TheraBrake Academy',
  description: 'Manage your affiliate links and track performance',
}

export default function AffiliatePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Affiliate Links Management
        </h1>
        <p className="text-gray-600">
          Create and manage affiliate links for courses and programs to earn commissions.
        </p>
      </div>
      
      <AffiliateLinksManager />
    </div>
  )
}