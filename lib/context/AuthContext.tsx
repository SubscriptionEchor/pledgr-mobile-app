import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, StorageKeys } from '@/lib/enums';
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
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    AsyncStorage.getItem(StorageKeys.IS_CREATOR_CREATED).then(value => {
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
        AsyncStorage.setItem(StorageKeys.TOKEN, accessToken),
        AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(mockUser)),
        AsyncStorage.setItem(StorageKeys.USER_ROLE, UserRole.MEMBER),
        AsyncStorage.setItem(StorageKeys.IS_CREATOR_CREATED, 'false'),
        AsyncStorage.setItem(StorageKeys.REMEMBER_ME, 'true'), // Always remember Google sign-ins
        AsyncStorage.setItem(StorageKeys.REMEMBER_ME_CREDS, JSON.stringify({ email: userInfo.email }))
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
      // First check if "Remember Me" is enabled
      const rememberMe = await AsyncStorage.getItem(StorageKeys.REMEMBER_ME);
      
      // If "Remember Me" is not enabled, clear auth data and redirect to sign in
      if (rememberMe !== 'true') {
        await AsyncStorage.multiRemove([
          StorageKeys.TOKEN,
          StorageKeys.USER,
          StorageKeys.USER_ROLE,
          StorageKeys.IS_CREATOR_CREATED,
          StorageKeys.REMEMBER_ME_CREDS
        ]);
        router.replace('/auth/sign-in');
        return;
      }

      // If "Remember Me" is enabled, proceed with normal auth check
      const [token, userRole, userData, creatorCreated] = await Promise.all([
        AsyncStorage.getItem(StorageKeys.TOKEN),
        AsyncStorage.getItem(StorageKeys.USER_ROLE),
        AsyncStorage.getItem(StorageKeys.USER),
        AsyncStorage.getItem(StorageKeys.IS_CREATOR_CREATED)
      ]);

      if (!token || !userRole || !userData) {
        await AsyncStorage.multiRemove([
          StorageKeys.TOKEN,
          StorageKeys.USER,
          StorageKeys.USER_ROLE,
          StorageKeys.IS_CREATOR_CREATED,
          StorageKeys.REMEMBER_ME_CREDS
        ]);
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
      await AsyncStorage.multiRemove([
        StorageKeys.TOKEN,
        StorageKeys.USER,
        StorageKeys.USER_ROLE,
        StorageKeys.IS_CREATOR_CREATED,
        StorageKeys.REMEMBER_ME_CREDS
      ]);
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

      // Store auth data and remember me preference
      await Promise.all([
        AsyncStorage.setItem(StorageKeys.TOKEN, 'mock_token'),
        AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(mockUser)),
        AsyncStorage.setItem(StorageKeys.REMEMBER_ME, rememberMe.toString()),
        AsyncStorage.setItem(StorageKeys.USER_ROLE, UserRole.MEMBER),
        AsyncStorage.setItem(StorageKeys.IS_CREATOR_CREATED, 'false'),
        // Store credentials if remember me is enabled
        AsyncStorage.setItem(StorageKeys.REMEMBER_ME_CREDS, JSON.stringify({ email, password }))
      ]);

      setUser(mockUser);
      setIsCreatorCreated(false);
      router.replace('/member/home');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockUser = {
        id: Date.now().toString(),
        name: email.split('@')[0], // Use email username as initial name
        email,
        role: UserRole.MEMBER,
        avatar: `https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400`
      };

      await Promise.all([
        AsyncStorage.setItem(StorageKeys.TOKEN, 'mock_token'),
        AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(mockUser)),
        AsyncStorage.setItem(StorageKeys.USER_ROLE, UserRole.MEMBER),
        AsyncStorage.setItem(StorageKeys.IS_CREATOR_CREATED, 'false'),
        AsyncStorage.setItem(StorageKeys.REMEMBER_ME, 'true'), // Always remember new sign-ups
        AsyncStorage.setItem(StorageKeys.REMEMBER_ME_CREDS, JSON.stringify({ email, password }))
      ]);

      setUser(mockUser);
      setIsCreatorCreated(false);
      router.replace('/member/home');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
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
      // Only remove auth-related data, preserve remember me preference if enabled
      const rememberMe = await AsyncStorage.getItem(StorageKeys.REMEMBER_ME);
      const keysToRemove = [
        StorageKeys.TOKEN,
        StorageKeys.USER,
        StorageKeys.USER_ROLE,
        StorageKeys.IS_CREATOR_CREATED
      ];

      // If remember me is disabled, also remove credentials
      if (rememberMe !== 'true') {
        keysToRemove.push(StorageKeys.REMEMBER_ME_CREDS);
      }

      await AsyncStorage.multiRemove(keysToRemove);
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
        AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(updatedUser)),
        AsyncStorage.setItem(StorageKeys.USER_ROLE, role)
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
    await AsyncStorage.setItem(StorageKeys.IS_CREATOR_CREATED, value.toString());
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
      setIsCreatorCreated: handleSetIsCreatorCreated,
      signUp
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