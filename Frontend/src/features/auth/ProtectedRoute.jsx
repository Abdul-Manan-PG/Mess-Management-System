import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  // 1. Read the REAL token and role
  const token = localStorage.getItem('studentToken'); // Changed from isAuthenticated
  const userRole = localStorage.getItem('userRole');

  // 2. If no token exists, they are not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Check if their role is allowed for this specific route
  if (!allowedRoles.includes(userRole)) {
    // If a student tries to enter admin area, send them back to student dashboard
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }

  // 4. Everything is good!
  return children;
}