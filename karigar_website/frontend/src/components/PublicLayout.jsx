import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFAB from './WhatsAppFAB'
import MobileTabBar from './MobileTabBar'

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-[#0E1E3A] overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <WhatsAppFAB />
      <MobileTabBar />
    </div>
  )
}
