import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/services/auth.service';
import { profileService } from '../api/services/profile.service';
import { managerService } from '../api/services/manager.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEventManager, setIsEventManager] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const profile = await profileService.getMyProfile();
          if (profile.status === 'BANNED') {
            authService.logout();
            setUser(null);
            setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.");
          } else {
            setUser(profile);
            // Check if user is event manager of any event
            try {
              const { isEventManager: isEM } = await managerService.checkIsEventManager();
              setIsEventManager(isEM);
            } catch {
              setIsEventManager(false);
            }
          }
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (usernameOrEmail, password) => {
    setError(null);
    try {
      await authService.login(usernameOrEmail, password);
      const profile = await profileService.getMyProfile();
      
      if (profile.status === 'BANNED') {
        authService.logout();
        setUser(null);
        throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.");
      }
      
      setUser(profile);
      // Check if user is event manager of any event
      try {
        const { isEventManager: isEM } = await managerService.checkIsEventManager();
        setIsEventManager(isEM);
      } catch {
        setIsEventManager(false);
      }
      return profile;
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Đăng nhập thất bại';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
    setIsEventManager(false);
  }, []);

  const refreshUser = useCallback(async () => {
    if (authService.isAuthenticated()) {
      try {
        const profile = await profileService.getMyProfile();
        if (profile.status === 'BANNED') {
          logout();
          setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.");
          return null;
        }
        setUser(profile);
        return profile;
      } catch (err) {
        console.error('Failed to refresh user:', err);
        logout();
      }
    }
    return null;
  }, [logout]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    // Helper getters for role checking
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER',
    isVolunteer: user?.role === 'USER',
    // Event manager status (manages at least one event)
    isEventManager,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
