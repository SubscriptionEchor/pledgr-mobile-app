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
  setUser: (user: User | null) => void;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
  isCreatorCreated: boolean;
  setIsCreatorCreated: (value: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId || '';
const GOOGLE_EXPO_CLIENT_ID = Constants.expoConfig?.extra?.googleExpoClientId || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
        StorageKeys.ACCESS_TOKEN_MEMBER,
        StorageKeys.ACCESS_TOKEN_CAMPAIGN,
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
    // if (!user) return;

    try {
      setIsLoading(true);
      const updatedUser = { ...user, role };
      await Promise.all([
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetIsCreatorCreated = async (value: boolean) => {
    await AsyncStorage.setItem(StorageKeys.IS_CREATOR_CREATED, value.toString());
    setIsCreatorCreated(value);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isLoading,
      loginWithGoogle,
      logout,
      updateUserRole,
      isCreatorCreated,
      setIsCreatorCreated: handleSetIsCreatorCreated,
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