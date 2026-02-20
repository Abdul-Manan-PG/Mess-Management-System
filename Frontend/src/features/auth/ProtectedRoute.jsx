import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  // Read the authentication status and role from local storage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('role');

  // If they aren't logged in at all, kick them to the login screen
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in but trying to access a page they shouldn't 
  // (e.g., a student trying to hit /admin-dashboard)
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }

  // If everything is correct, let them see the page
  return children;
}