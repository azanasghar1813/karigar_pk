import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

/**
 * AdminRoute — guards any /admin/* route.
 * Redirects to / if the user is not logged in or not an admin.
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) return null

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
