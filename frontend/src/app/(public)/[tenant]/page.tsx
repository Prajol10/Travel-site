import HeroSection from '@/components/sections/HeroSection'
import TrustBar from '@/components/sections/TrustBar'
import FeaturedJourney from '@/components/sections/FeaturedJourney'
import PopularTours from '@/components/sections/PopularTours'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import AboutSection from '@/components/sections/AboutSection'
import Testimonials from '@/components/sections/Testimonials'
import BlogSection from '@/components/sections/BlogSection'
import GallerySection from '@/components/sections/GallerySection'
import CTASection from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturedJourney />
      <PopularTours />
      <WhyChooseUs />
      <AboutSection />
      <Testimonials />
      <BlogSection />
      <GallerySection />
      <CTASection />
    </>
  )
}
