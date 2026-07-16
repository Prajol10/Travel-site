export interface Tenant {
  id: string
  name: string
  subdomain: string
  customDomain?: string
  status: string
  logoUrl?: string
  faviconUrl?: string
  primaryColor?: string
  secondaryColor?: string
  tagLine?: string
  phoneNumber?: string
  whatsAppNumber?: string
  email?: string
  address?: string
  facebookUrl?: string
  instagramUrl?: string
  youTubeUrl?: string
  twitterUrl?: string
  defaultCurrency?: string
  supportedCurrencies?: string
  metaTitle?: string
  metaDescription?: string
  ogImageUrl?: string
  googleAnalyticsId?: string
  createdAt: string
}

export interface TourPackage {
  id: string
  tenantId: string
  categoryId?: string
  categoryName?: string
  title: string
  slug: string
  shortDescription?: string
  fullDescription?: string
  highlights?: string
  itinerary?: string
  inclusions?: string
  exclusions?: string
  durationDays: number
  durationNights: number
  priceUSD: number
  priceINR?: number
  priceEUR?: number
  coverImageUrl?: string
  imageUrls?: string
  difficulty?: string
  maxAltitude?: string
  maxGroupSize?: number
  rating?: number
  reviewCount?: number
  isFeatured: boolean
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

export interface TourListDto {
  id: string
  title: string
  slug: string
  shortDescription?: string
  coverImageUrl?: string
  durationDays: number
  durationNights: number
  priceUSD: number
  priceINR?: number
  priceEUR?: number
  categoryName?: string
  difficulty?: string
  rating?: number
  reviewCount?: number
  isFeatured: boolean
}

export interface ContentSection {
  id: string
  sectionType: string
  title?: string
  subtitle?: string
  body?: string
  imageUrl?: string
  secondaryImageUrl?: string
  badgeText?: string
  ctaText?: string
  ctaUrl?: string
  secondaryCtaText?: string
  secondaryCtaUrl?: string
  jsonData?: string
  isActive: boolean
  updatedAt: string
}

export interface Testimonial {
  id: string
  authorName: string
  authorPhotoUrl?: string
  authorLocation?: string
  tourName?: string
  reviewText: string
  rating: number
  reviewDate?: string
  sourcePlatform?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
}

export interface GalleryItem {
  id: string
  url: string
  thumbnailUrl?: string
  caption?: string
  mediaType: string
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: string
  coverImageUrl?: string
  category?: string
  status: string
  seoTitle?: string
  seoDescription?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  fullName: string
  role?: string
  region?: string
  phoneNumber?: string
  email?: string
  photoUrl?: string
  sortOrder: number
  isActive: boolean
}

export interface StatItem {
  id: string
  value: string
  label: string
  iconName?: string
  sortOrder: number
  isActive: boolean
}

export interface WhyChooseUsItem {
  id: string
  title: string
  description: string
  iconName?: string
  sortOrder: number
  isActive: boolean
}

export interface Destination {
  id: string
  name: string
  country?: string
  description: string
  imageUrl?: string
  sortOrder: number
  isActive: boolean
}

export interface HomepageData {
  tenant: Tenant
  content: ContentSection[]
  tours: TourListDto[]
  testimonials: Testimonial[]
  gallery: GalleryItem[]
  team: TeamMember[]
  blogs: BlogPost[]
  stats: StatItem[]
  whyChooseUs: WhyChooseUsItem[]
  destinations: Destination[]
}

export interface AuthResponse {
  token: string
  fullName: string
  email: string
  role: string
  tenantId?: string
  expiresAt: string
}

export type Currency = 'USD' | 'INR' | 'EUR'
