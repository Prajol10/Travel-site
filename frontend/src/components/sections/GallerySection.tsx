'use client'

import { useState } from 'react'
import { Image as ImageIcon, Video } from 'lucide-react'
import { useTenant } from '@/context/TenantContext'

export default function GallerySection() {
  const { data } = useTenant()
  const [tab, setTab] = useState<'Photo' | 'Video'>('Photo')

  const items = (data?.gallery || []).filter((g) => g.mediaType === tab)
  const displayItems = items.slice(0, 5)

  if (!data?.gallery || data.gallery.length === 0) return null

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-10">
          <div className="section-label justify-center mb-5">Memories &amp; Moments</div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Guest Photo &amp; Video Gallery</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real moments captured by our travelers during their incredible journeys
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-10">
          <button
            onClick={() => setTab('Photo')}
            className={tab === 'Photo' ? 'btn-gold' : 'btn-outline-gold'}
          >
            <ImageIcon size={16} /> Photos
          </button>
          <button
            onClick={() => setTab('Video')}
            className={tab === 'Video' ? 'btn-gold' : 'btn-outline-gold'}
          >
            <Video size={16} /> Videos
          </button>
        </div>

        {displayItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
            {displayItems.map((item, i) => (
              <div
                key={item.id}
                className={
                  i === 0
                    ? 'col-span-2 row-span-2 rounded-xl overflow-hidden relative group cursor-pointer'
                    : 'rounded-xl overflow-hidden relative group cursor-pointer'
                }
              >
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.caption || ''}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {item.caption && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-sm font-medium">{item.caption}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No {tab.toLowerCase()}s yet</p>
        )}
      </div>
    </section>
  )
}
