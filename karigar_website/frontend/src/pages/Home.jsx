import Hero from '../components/Hero'
import TopRatedSection from '../components/TopRatedSection'
import Testimonials from '../components/Testimonials'
import WhyKarigar from '../components/WhyKarigar'
import HowItWorks from '../components/HowItWorks'

export default function Home() {
  return (
    <div className="bg-[#0B1329] min-h-screen">
      <Hero />
      <TopRatedSection />
      <Testimonials />
      <WhyKarigar />
      <HowItWorks />
    </div>
  )
}
