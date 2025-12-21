import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requiredRoles = [], allowEventManager = false }) => {
  const { user, loading, isAuthenticated, isEventManager } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to sign in, but save the location they were trying to go to
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check for required roles if specified
  // If allowEventManager is true, allow access if user is an event manager regardless of role
  const hasRole = requiredRoles.length === 0 || requiredRoles.includes(user?.role);
  const isAllowedEventManager = allowEventManager && isEventManager;

  if (!hasRole && !isAllowedEventManager) {
    // User doesn't have required role AND is not an allowed event manager
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  allowEventManager: PropTypes.bool,
};

export default ProtectedRoute;
