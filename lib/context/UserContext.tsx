import React, { useState, useContext, ReactNode, createContext, useEffect } from 'react';
import { commonAPI } from '@/lib/api/common';

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
  const [countries, setCountries] = useState<Country[]>([]);
  const [locationInfo, setLocationInfo] = useState<{
    countryName?: string;
    stateName?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch countries when the provider mounts
  useEffect(() => {
    const fetchCountries = async () => {
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
  }, []);

  return (
    <UserContext.Provider value={{ 
      memberSettings, 
      setMemberSettings,
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