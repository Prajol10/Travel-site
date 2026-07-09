'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface TenantUser {
  id: string
  fullName: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

const inputStyle = { width: '100%', padding: '0.55rem 0.7rem', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '0.85rem' }
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }

export default function TenantUsers({ tenantId }: { tenantId: string }) {
  const [users, setUsers] = useState<TenantUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ fullName: '', email: '', password: '' })
  const [addError, setAddError] = useState('')
  const [addSaving, setAddSaving] = useState(false)
  const [resetTarget, setResetTarget] = useState<TenantUser | null>(null)
  const [resetPassword, setResetPassword] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetSaving, setResetSaving] = useState(false)

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await api.get(`/api/superadmin/tenants/${tenantId}/users`)
      setUsers(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [tenantId])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAddError('')
    setAddSaving(true)
    try {
      await api.post(`/api/superadmin/tenants/${tenantId}/users`, addForm)
      setShowAdd(false)
      setAddForm({ fullName: '', email: '', password: '' })
      loadUsers()
    } catch (err: any) {
      setAddError(err.response?.data?.message || 'Failed to create admin account')
    } finally {
      setAddSaving(false)
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!resetTarget) return
    setResetError('')
    setResetSaving(true)
    try {
      await api.put(`/api/superadmin/tenants/${tenantId}/users/${resetTarget.id}/reset-password`, { newPassword: resetPassword })
      setResetTarget(null)
      setResetPassword('')
    } catch (err: any) {
      setResetError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setResetSaving(false)
    }
  }

  async function toggleStatus(user: TenantUser) {
    await api.put(`/api/superadmin/tenants/${tenantId}/users/${user.id}/status`, { isActive: !user.isActive })
    loadUsers()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Admin accounts that can log into this travel site's admin panel.
        </span>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          style={{ padding: '0.5rem 0.9rem', background: 'var(--navy, #1B2B4B)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
        >
          + Add Admin
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.85rem' }}>Loading...</div>
      ) : users.length === 0 ? (
        <div style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.85rem' }}>No admin accounts yet.</div>
      ) : (
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
          {users.map((u, i) => (
            <div
              key={u.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderTop: i === 0 ? 'none' : '1px solid #F1F5F9',
              }}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>{u.fullName}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{u.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: u.isActive ? '#DCFCE7' : '#FEE2E2',
                    color: u.isActive ? '#166534' : '#991B1B',
                  }}
                >
                  {u.isActive ? 'Active' : 'Deactivated'}
                </span>
                <button
                  type="button"
                  onClick={() => { setResetTarget(u); setResetPassword(''); setResetError('') }}
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => toggleStatus(u)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.78rem',
                    border: u.isActive ? '1px solid #FCA5A5' : '1px solid #86EFAC',
                    color: u.isActive ? '#B91C1C' : '#166534',
                    borderRadius: '6px',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {u.isActive ? 'Deactivate' : 'Reactivate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <form onSubmit={handleAdd} style={{ background: '#fff', borderRadius: '10px', padding: '1.75rem', width: '380px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--navy, #1B2B4B)' }}>Add Admin</h3>

            {addError && (
              <div style={{ marginBottom: '0.85rem', padding: '0.6rem 0.75rem', background: '#FEF2F2', color: '#B91C1C', fontSize: '0.8rem', borderRadius: '8px' }}>
                {addError}
              </div>
            )}

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={labelStyle}>Full Name</label>
              <input
                required
                value={addForm.fullName}
                onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                style={{ flex: 1, padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', background: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addSaving}
                style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', background: 'var(--navy, #1B2B4B)', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: addSaving ? 0.7 : 1 }}
              >
                {addSaving ? 'Adding...' : 'Add Admin'}
              </button>
            </div>
          </form>
        </div>
      )}

      {resetTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <form onSubmit={handleResetPassword} style={{ background: '#fff', borderRadius: '10px', padding: '1.75rem', width: '380px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--navy, #1B2B4B)' }}>Reset Password</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>For {resetTarget.email}</p>

            {resetError && (
              <div style={{ marginBottom: '0.85rem', padding: '0.6rem 0.75rem', background: '#FEF2F2', color: '#B91C1C', fontSize: '0.8rem', borderRadius: '8px' }}>
                {resetError}
              </div>
            )}

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setResetTarget(null)}
                style={{ flex: 1, padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '8px', background: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={resetSaving}
                style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: '8px', background: 'var(--navy, #1B2B4B)', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: resetSaving ? 0.7 : 1 }}
              >
                {resetSaving ? 'Saving...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
