import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/services/auth.service';
import { profileService } from '../api/services/profile.service';
import { managerService } from '../api/services/manager.service';

const AuthContext = createContext(null);

/**
 * AuthProvider component that manages authentication state and provides auth methods.
 * Handles user login, logout, profile refresh, and role checking.
 */
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

  /**
   * Logs in user with credentials and fetches profile.
   * 
   * @param {string} usernameOrEmail - Username or email
   * @param {string} password - User password
   * @returns {Promise<Object>} User profile
   * @throws {Error} If login fails or account is banned
   */
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
      const serverMessage = err.response?.data?.message;
      let errorMessage = serverMessage || err.message || 'Đăng nhập thất bại';
      
      // Translate backend messages to Vietnamese
      if (serverMessage === 'Your account should be activated before login') {
        errorMessage = 'Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để xác minh tài khoản.';
      } else if (serverMessage === 'Your account has been banned') {
        errorMessage = 'Tài khoản của bạn đã bị cấm. Xin liên hệ với admin để được hỗ trợ.';
      }
      
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Logs out user and clears auth state.
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
    setIsEventManager(false);
  }, []);

  /**
   * Refreshes user profile from server.
   * 
   * @returns {Promise<Object|null>} Updated profile or null
   */
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

/**
 * Hook to access auth context with user state and auth methods.
 * 
 * @returns {Object} Auth context with user, login, logout, and role helpers
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
