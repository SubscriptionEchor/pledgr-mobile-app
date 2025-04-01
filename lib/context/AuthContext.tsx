import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '@/lib/enums';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { showToast } from '@/components/Toast';

WebBrowser.maybeCompleteAuthSession();

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
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  checkAuth: () => Promise<void>;
  isCreatorCreated: boolean;
  setIsCreatorCreated: (value: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';
const REMEMBER_ME_KEY = '@remember_me';
const USER_ROLE_KEY = '@user_role';
const IS_CREATOR_CREATED_KEY = '@is_creator_created';

const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId || '';
const GOOGLE_EXPO_CLIENT_ID = Constants.expoConfig?.extra?.googleExpoClientId || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatorCreated, setIsCreatorCreated] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    expoClientId: GOOGLE_EXPO_CLIENT_ID,
  });

  useEffect(() => {
    AsyncStorage.getItem(IS_CREATOR_CREATED_KEY).then(value => {
      setIsCreatorCreated(value === 'true');
    });
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleResponse(authentication?.accessToken);
    }
  }, [response]);

  const handleGoogleResponse = async (accessToken: string | undefined) => {
    if (!accessToken) return;

    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userInfo = await response.json();
      const mockUser = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        role: UserRole.MEMBER,
        avatar: userInfo.picture,
      };

      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, accessToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser)),
        AsyncStorage.setItem(USER_ROLE_KEY, UserRole.MEMBER),
        AsyncStorage.setItem(IS_CREATOR_CREATED_KEY, 'false')
      ]);

      setUser(mockUser);
      setIsCreatorCreated(false);
      router.replace('/member/home');
    } catch (error) {
      console.error('Error fetching Google user info:', error);
      showToast.error('Google sign in failed', 'Please try again');
    }
  };

  const checkAuth = async () => {
    try {
      const [token, userRole, userData, creatorCreated] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_ROLE_KEY),
        AsyncStorage.getItem(USER_KEY),
        AsyncStorage.getItem(IS_CREATOR_CREATED_KEY)
      ]);

      if (!token || !userRole || !userData) {
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, USER_ROLE_KEY, REMEMBER_ME_KEY, IS_CREATOR_CREATED_KEY]);
        router.replace('/auth/sign-in');
        return;
      }

      const parsedUser = JSON.parse(userData);
      const user = {
        ...parsedUser,
        role: userRole as UserRole
      };

      setUser(user);
      setIsCreatorCreated(creatorCreated === 'true');

      // Route based on stored role
      switch (userRole) {
        case UserRole.CREATOR:
          router.replace('/creator/home');
          break;
        case UserRole.CREATOR_ASSOCIATE:
          router.replace('/creator/home');
          break;
        case UserRole.MEMBER:
          router.replace('/member/home');
          break;
        default:
          router.replace('/auth/sign-in');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, USER_ROLE_KEY, REMEMBER_ME_KEY, IS_CREATOR_CREATED_KEY]);
      router.replace('/auth/sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUser = {
        id: '1',
        name: 'John Doe',
        email,
        role: UserRole.MEMBER,
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400'
      };

      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, 'mock_token'),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser)),
        AsyncStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString()),
        AsyncStorage.setItem(USER_ROLE_KEY, UserRole.MEMBER),
        AsyncStorage.setItem(IS_CREATOR_CREATED_KEY, 'false')
      ]);

      setUser(mockUser);
      setIsCreatorCreated(false);
      router.replace('/member/home');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!request) return;
    await promptAsync();
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, USER_ROLE_KEY, REMEMBER_ME_KEY, IS_CREATOR_CREATED_KEY]);
      setUser(null);
      setIsCreatorCreated(false);
      router.replace('/auth/sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, role };
      await Promise.all([
        AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser)),
        AsyncStorage.setItem(USER_ROLE_KEY, role)
      ]);
      
      setUser(updatedUser);

      switch (role) {
        case UserRole.CREATOR:
          router.replace('/creator/home');
          break;
        case UserRole.CREATOR_ASSOCIATE:
          router.replace('/creator/home');
          break;
        case UserRole.MEMBER:
          router.replace('/member/home');
          break;
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      showToast.error('Failed to update role', 'Please try again');
    }
  };

  const handleSetIsCreatorCreated = async (value: boolean) => {
    await AsyncStorage.setItem(IS_CREATOR_CREATED_KEY, value.toString());
    setIsCreatorCreated(value);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      loginWithGoogle,
      logout,
      updateUserRole,
      checkAuth,
      isCreatorCreated,
      setIsCreatorCreated: handleSetIsCreatorCreated
    }}>
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