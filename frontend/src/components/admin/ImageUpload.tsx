'use client'

import { useRef, useState } from 'react'
import api from '@/lib/api'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  recommendedSize?: string
  label?: string
  tenantId?: string
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'general',
  recommendedSize = '1600 x 1067',
  label = 'Image',
  tenantId,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file: File) {
    setError('')

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setError('Only JPEG, PNG, WEBP, or GIF images are allowed')
      return
    }
    if (file.size > 10_000_000) {
      setError('File must be under 10MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      if (tenantId) formData.append('tenantId', tenantId)

      const res = await api.post('/api/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (!res.data.success) {
        throw new Error(res.data.message || 'Upload failed')
      }

      onChange(res.data.data.url)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#1B2B4B', marginBottom: '0.4rem' }}>
        {label}
      </label>

      {value ? (
        <div style={{ position: 'relative', marginBottom: '0.6rem' }}>
          <img
            src={value}
            alt="Preview"
            style={{ width: '100%', maxWidth: '360px', height: '200px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E2E8F0' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', border: '1px solid #FCA5A5', borderRadius: '6px', background: '#fff', color: '#DC2626', cursor: 'pointer' }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          style={{
            width: '100%',
            maxWidth: '360px',
            height: '160px',
            border: '2px dashed #CBD5E1',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: '#F8FAFC',
            marginBottom: '0.4rem',
          }}
        >
          {uploading ? (
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Uploading...</span>
          ) : (
            <>
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>Click or drag image to upload</span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>JPEG, PNG, WEBP, GIF — max 10MB</span>
            </>
          )}
        </div>
      )}

      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Recommended size: {recommendedSize}</span>

      {error && (
        <div style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '0.3rem' }}>{error}</div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
