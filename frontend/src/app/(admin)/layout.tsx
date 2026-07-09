import DashboardShell from '@/components/admin/DashboardShell'

const navGroups = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin/dashboard' }],
  },
  {
    label: 'Website Sections',
    items: [
      { label: 'Hero Section', href: '/admin/content/hero' },
      { label: 'About Section', href: '/admin/content/about' },
      { label: 'Why Choose Us', href: '/admin/content/whychooseus' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Tours', href: '/admin/tours' },
      { label: 'Tour Categories', href: '/admin/categories' },
      { label: 'Blog', href: '/admin/blog' },
      { label: 'Gallery', href: '/admin/gallery' },
      { label: 'Team', href: '/admin/team' },
    ],
  },
  {
    label: 'Business',
    items: [
      { label: 'Leads', href: '/admin/leads' },
      { label: 'Settings', href: '/admin/settings' },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navGroups={navGroups} requiredRole="TenantAdmin" title="Admin Panel">
      {children}
    </DashboardShell>
  )
}
