import { redirect } from 'next/navigation'

export default async function AdminIndexPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  redirect(`/${tenant}/admin/dashboard`)
}
