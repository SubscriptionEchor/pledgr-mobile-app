import React, { useState, useContext, ReactNode, createContext, useEffect } from 'react';
import { commonAPI } from '@/lib/api/common';
import { StorageKeys } from '@/lib/enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreatorSettings } from '@/hooks/useCreatorSettings';

interface MemberSettings {
  type: string;
  profile: {
    display_name: string;
    country?: string;
    state?: string;
    profile_photo?: string;
  };
  security: {
    public_profile: boolean;
  };
  content_preferences: {
    language: string;
    adult_content: boolean;
  };
  notification_preferences: {
    email: {
      marketing: boolean;
      newsletter: boolean;
      special_offers: boolean;
      comment_replies: boolean;
      creator_updates: boolean;
    };
  };
}

interface Country {
  id: string;
  name: string;
  iso2: string;
  iso3: string;
  emoji: string;
}

interface UserContextType {
  memberSettings: MemberSettings | null;
  setMemberSettings: (settings: MemberSettings) => void;
  creatorSettings: CreatorSettings | null;
  setCreatorSettings: (settings: CreatorSettings) => void;
  countries: Country[];
  setCountries: (countries: Country[]) => void;
  locationInfo: {
    countryName?: string;
    stateName?: string;
  };
  setLocationInfo: (info: { countryName?: string; stateName?: string; }) => void;
  isLoading: boolean;
}

// Create the context with a default value
export const UserContext = createContext<UserContextType>({
  memberSettings: null,
  setMemberSettings: () => {},
  creatorSettings: null,
  setCreatorSettings: () => {},
  countries: [],
  setCountries: () => {},
  locationInfo: {},
  setLocationInfo: () => {},
  isLoading: false,
});

// Export the hook for using the context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [memberSettings, setMemberSettings] = useState<MemberSettings | null>(null);
  const [creatorSettings, setCreatorSettings] = useState<CreatorSettings | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [locationInfo, setLocationInfo] = useState<{
    countryName?: string;
    stateName?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem(StorageKeys.TOKEN);
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  // Fetch countries when authenticated
  useEffect(() => {
    const fetchCountries = async () => {
      if (!isAuthenticated) {
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await commonAPI.getCountries();
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCountries();
  }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ 
      memberSettings, 
      setMemberSettings,
      creatorSettings,
      setCreatorSettings,
      countries,
      setCountries,
      locationInfo,
      setLocationInfo,
      isLoading,
    }}>
      {children}
    </UserContext.Provider>
  );
}