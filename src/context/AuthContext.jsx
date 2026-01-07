import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem('rentchain_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Hardcoded credentials check
    if (email === 'asingh432086@gmail.com' && password === '111111') {
      const userData = { name: '__aman singh', email };
      setUser(userData);
      localStorage.setItem('rentchain_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password) => {
    // Mock signup - just logs them in as the requested user name/email
    // ignoring password for the mock, or just setting it.
    // User requested "use these credentials" essentially.
    
    // For the "Signup" flow, let's just log them in as the name they provided
    // OR force the requested one. 
    // Let's use the requested name "__aman singh" if they try to sign up with the specific email,
    // otherwise just use what they typed for the name.
    
    const userData = { name: name || '__aman singh', email };
    setUser(userData);
    localStorage.setItem('rentchain_user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rentchain_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
