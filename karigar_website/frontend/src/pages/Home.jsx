import Hero from '../components/Hero'
import TopRatedSection from '../components/TopRatedSection'
import HowItWorks from '../components/HowItWorks'
import WhyKarigar from '../components/WhyKarigar'
import Testimonials from '../components/Testimonials'

export default function Home() {
  return (
    <div className="bg-[#F5F7FB] min-h-screen">
      <Hero />
      <TopRatedSection />
      <HowItWorks />
      <WhyKarigar />
      <Testimonials />
    </div>
  )
}
