import React, { useEffect, useState, createContext, useContext } from 'react';
type User = {
  firstName: string;
  email: string;
} | null;
type AuthContextType = {
  user: User;
  login: (userData: {
    firstName: string;
    email: string;
  }) => void;
  logout: () => void;
  isAuthenticated: boolean;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
type AuthProviderProps = {
  children: ReactNode;
};
export const AuthProvider = ({
  children
}: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);
  const login = (userData: {
    firstName: string;
    email: string;
  }) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };
  return <AuthContext.Provider value={{
    user,
    login,
    logout,
    isAuthenticated
  }}>
      {children}
    </AuthContext.Provider>;
};