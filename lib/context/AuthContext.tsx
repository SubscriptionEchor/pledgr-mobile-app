import { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/enums';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with mock user immediately
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.MEMBER,
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400'
    });
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      setUser({
        id: '1',
        name: 'John Doe',
        email,
        role: UserRole.MEMBER,
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (!user) return;
    
    setUser({ ...user, role });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUserRole }}>
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