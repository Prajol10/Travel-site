import DashboardShell from '@/components/admin/DashboardShell'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params

  const navGroups = [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', href: `/${tenant}/admin/dashboard` }],
    },
    {
      label: 'Website Sections',
      items: [
        { label: 'Hero Section', href: `/${tenant}/admin/content/hero` },
        { label: 'About Section', href: `/${tenant}/admin/content/about` },
        { label: 'Why Choose Us', href: `/${tenant}/admin/content/whychooseus` },
      ],
    },
    {
      label: 'Content',
      items: [
        { label: 'Tours', href: `/${tenant}/admin/tours` },
        { label: 'Tour Categories', href: `/${tenant}/admin/categories` },
        { label: 'Blog', href: `/${tenant}/admin/blog` },
        { label: 'Gallery', href: `/${tenant}/admin/gallery` },
        { label: 'Team', href: `/${tenant}/admin/team` },
        { label: 'Testimonials', href: `/${tenant}/admin/testimonials` },
      ],
    },
    {
      label: 'Legal Pages',
      items: [
        { label: 'Privacy Policy', href: `/${tenant}/admin/content/privacy` },
        { label: 'Terms of Service', href: `/${tenant}/admin/content/terms` },
        { label: 'Booking Terms', href: `/${tenant}/admin/content/booking-terms` },
        { label: 'Document Requirements', href: `/${tenant}/admin/content/document-requirements` },
        { label: 'Pricing Policy', href: `/${tenant}/admin/content/pricing` },
      ],
    },
    {
      label: 'Business',
      items: [
        { label: 'Leads', href: `/${tenant}/admin/leads` },
        { label: 'Settings', href: `/${tenant}/admin/settings` },
      ],
    },
  ]

  return (
    <DashboardShell navGroups={navGroups} requiredRole="TenantAdmin" title="Admin Panel" tenantSlug={tenant}>
      {children}
    </DashboardShell>
  )
}
