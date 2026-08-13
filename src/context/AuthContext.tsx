import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChanged, getAdminClaims } from '../lib/auth';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  role: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  role: '',
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const claims = await getAdminClaims(u);
        setIsAdmin(claims.isAdmin);
        setRole(claims.role);
      } else {
        setIsAdmin(false);
        setRole('');
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
