import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AdminRoute from './components/AdminRoute'
import PublicLayout from './components/PublicLayout'
import AdminLayout from './components/AdminLayout'
import KarigarLayout from './components/KarigarLayout'
import KarigarRoute from './components/KarigarRoute'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
// Public pages
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import FindKarigar from './pages/FindKarigar'
import WorkerProfile from './pages/WorkerProfile'
import BookNow from './pages/BookNow'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import RegisterKarigar from './pages/RegisterKarigar'
import JoinKarigar from './pages/JoinKarigar'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminKarigars from './pages/admin/AdminKarigars'
import AdminUsers from './pages/admin/AdminUsers'
import AdminLeads from './pages/admin/AdminLeads'
import AdminBookings from './pages/admin/AdminBookings'
import AdminServices from './pages/admin/AdminServices'
import AdminReviews from './pages/admin/AdminReviews'

// Karigar Dashboard
import KarigarPending from './pages/karigar/KarigarPending'
import KarigarDashboard from './pages/karigar/KarigarDashboard'
import KarigarRequests from './pages/karigar/KarigarRequests'
import KarigarSchedule from './pages/karigar/KarigarSchedule'
import KarigarHistory from './pages/karigar/KarigarHistory'
import KarigarProfile from './pages/karigar/KarigarProfile'
import KarigarReviews from './pages/karigar/KarigarReviews'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes — wrapped in PublicLayout (Navbar + Footer) */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/find-karigar" element={<PublicLayout><FindKarigar /></PublicLayout>} />
          <Route path="/worker/:id" element={<PublicLayout><WorkerProfile /></PublicLayout>} />
          <Route path="/book/:id" element={<PublicLayout><BookNow /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
          <Route path="/reset-password/:token" element={<PublicLayout><ResetPassword /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
          <Route path="/register-karigar" element={<PublicLayout><RegisterKarigar /></PublicLayout>} />
          <Route path="/join-karigar" element={<PublicLayout><JoinKarigar /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
          <Route path="/terms-and-conditions" element={<PublicLayout><TermsAndConditions /></PublicLayout>} />

          {/* Admin routes — protected by AdminRoute guard, wrapped in AdminLayout */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/karigars" element={
            <AdminRoute>
              <AdminLayout><AdminKarigars /></AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminLayout><AdminUsers /></AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/leads" element={
            <AdminRoute>
              <AdminLayout><AdminLeads /></AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/bookings" element={
            <AdminRoute>
              <AdminLayout><AdminBookings /></AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/services" element={
            <AdminRoute>
              <AdminLayout><AdminServices /></AdminLayout>
            </AdminRoute>
          } />
          <Route path="/admin/reviews" element={
            <AdminRoute>
              <AdminLayout><AdminReviews /></AdminLayout>
            </AdminRoute>
          } />

          {/* Karigar routes — protected by KarigarRoute guard, wrapped in KarigarLayout */}
          <Route path="/karigar" element={
            <KarigarRoute>
              <KarigarLayout />
            </KarigarRoute>
          }>
            <Route index element={<KarigarDashboard />} />
            <Route path="pending" element={<KarigarPending />} />
            <Route path="requests" element={<KarigarRequests />} />
            <Route path="schedule" element={<KarigarSchedule />} />
            <Route path="history" element={<KarigarHistory />} />
            <Route path="reviews" element={<KarigarReviews />} />
            <Route path="profile" element={<KarigarProfile />} />
          </Route>
        </Routes>
      </Router>
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  )
}

export default App