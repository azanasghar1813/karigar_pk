import Hero from '../components/Hero'
import DualCards from '../components/DualCards'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import WhyKarigar from '../components/WhyKarigar'
import Testimonials from '../components/Testimonials'

export default function Home() {
  return (
    <div>
      <Hero />
      <DualCards />
      <Services />
      <HowItWorks />
      <WhyKarigar />
      <Testimonials />
    </div>
  )
}