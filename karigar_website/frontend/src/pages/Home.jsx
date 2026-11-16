import Hero from '../components/Hero'
import TopRatedSection from '../components/TopRatedSection'
import Testimonials from '../components/Testimonials'

export default function Home() {
  return (
    <div className="bg-[#F5F7FB] min-h-screen">
      <Hero />
      <TopRatedSection />
      <Testimonials />
    </div>
  )
}
