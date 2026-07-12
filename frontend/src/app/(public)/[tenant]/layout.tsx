import { CurrencyProvider } from '@/context/CurrencyContext'
import { TenantProvider } from '@/context/TenantContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import { HomepageData } from '@/types'

async function getHomepageData(tenantSlug: string): Promise<HomepageData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5066'
  try {
    const url = `${apiUrl}/api/public/${tenantSlug}/homepage`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json.data as HomepageData
  } catch {
    return null
  }
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  const data = await getHomepageData(tenant)

  return (
    <TenantProvider data={data}>
      <CurrencyProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </CurrencyProvider>
    </TenantProvider>
  )
}
