// app/instructor/earnings/page.tsx
export default function InstructorEarningsPage() {
  const { data: earnings } = useQuery('instructor-earnings', getEarnings);
  const { data: affiliateStats } = useQuery('affiliate-stats', getAffiliateStats);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Earnings & Commissions</h1>
      
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Earnings"
          value={`$${earnings?.total_lifetime || 0}`}
          icon={<DollarSign />}
        />
        <StatsCard
          title="Pending Payout"
          value={`$${earnings?.pending_payout || 0}`}
          icon={<Clock />}
          subtitle="Next payout: Jan 31"
        />
        <StatsCard
          title="This Month"
          value={`$${earnings?.this_month || 0}`}
          icon={<TrendingUp />}
        />
        <StatsCard
          title="Affiliate Commissions"
          value={`$${affiliateStats?.total_commissions || 0}`}
          icon={<Users />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="affiliate">Affiliate Program</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="affiliate">
          <AffiliateSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AffiliateSection() {
  const { data: affiliateLink } = useQuery('affiliate-link', getAffiliateLink);
  
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Affiliate Program</h2>
        <p className="text-gray-700 mb-4">
          Earn 15% commission on every sale you refer to TheraBrake Academy
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Unique Link */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Your Unique Affiliate Link</h3>
            <div className="flex gap-2">
              <Input 
                value={affiliateLink?.link_url}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={() => copyToClipboard(affiliateLink?.link_url)}>
                Copy
              </Button>
            </div>
          </div>
          
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Your QR Code</h3>
            <div className="flex items-center gap-4">
              <img 
                src={affiliateLink?.qr_code_url} 
                alt="Affiliate QR Code"
                className="w-32 h-32"
              />
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Share this QR code on social media, business cards, or presentations
                </p>
                <Button size="sm" onClick={() => downloadQRCode()}>
                  Download QR Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Performance */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Affiliate Performance</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold">{affiliateLink?.total_clicks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversions</p>
              <p className="text-2xl font-bold">{affiliateLink?.total_conversions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold">
                {((affiliateLink?.total_conversions / affiliateLink?.total_clicks) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          <h4 className="font-semibold mb-3">Recent Referrals</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Course Purchased</TableHead>
                <TableHead>Your Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Recent affiliate sales */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}