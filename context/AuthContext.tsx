import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  loggedIn: boolean;
  role: string | null;
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState({ loggedIn: false, role: null as string | null});

  const login = (role: string) => setUser({ loggedIn: true, role }); // set role always, modify later with auth service
  const logout = () => setUser({ loggedIn: false, role: null });

  return (
    <AuthContext.Provider value={{ ...user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}