import { CurrencyProvider } from '@/context/CurrencyContext'
import { TenantProvider } from '@/context/TenantContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppFloat from '@/components/layout/WhatsAppFloat'
import { HomepageData } from '@/types'

async function getHomepageData(): Promise<HomepageData | null> {
  const subdomain = process.env.NEXT_PUBLIC_DEFAULT_SUBDOMAIN || 'demo'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5066'

  try {
    const url = `${apiUrl}/api/public/${subdomain}/homepage`
    console.log('[Layout] Fetching:', url)

    const res = await fetch(url, { cache: 'no-store' })
    console.log('[Layout] Status:', res.status)

    if (!res.ok) {
      console.log('[Layout] Not OK:', res.statusText)
      return null
    }

    const json = await res.json()
    console.log('[Layout] Data keys:', Object.keys(json.data || {}))
    console.log('[Layout] tours:', json.data?.tours?.length)
    console.log('[Layout] whyChooseUs:', json.data?.whyChooseUs?.length)
    console.log('[Layout] stats:', json.data?.stats?.length)
    console.log('[Layout] content:', json.data?.content?.length)

    return json.data as HomepageData
  } catch (e) {
    console.log('[Layout] Error:', e)
    return null
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await getHomepageData()
  console.log('[Layout] Final data:', data ? 'loaded' : 'null')

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
