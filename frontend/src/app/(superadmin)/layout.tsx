import DashboardShell from '@/components/admin/DashboardShell'

const navGroups = [
  {
    label: 'Overview',
    items: [{ label: 'Tenants', href: '/superadmin/dashboard' }],
  },
]

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navGroups={navGroups} requiredRole="SuperAdmin" title="Superadmin">
      {children}
    </DashboardShell>
  )
}
