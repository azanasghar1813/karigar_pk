import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFAB from './WhatsAppFAB'

/**
 * PublicLayout wraps all public-facing pages (Home, About, Services, etc.)
 * Provides the shared Navbar + Footer so individual pages don't import them.
 */
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
