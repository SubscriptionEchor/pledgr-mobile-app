import { createContext, useContext, useState } from 'react';
import { ProfileSheet } from '@/components/ProfileSheet';

interface ProfileSheetContextType {
  showProfileSheet: () => void;
  hideProfileSheet: () => void;
}

const ProfileSheetContext = createContext<ProfileSheetContextType | undefined>(undefined);

export function ProfileSheetProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  const showProfileSheet = () => setIsVisible(true);
  const hideProfileSheet = () => setIsVisible(false);

  return (
    <ProfileSheetContext.Provider value={{ showProfileSheet, hideProfileSheet }}>
      {children}
      <ProfileSheet visible={isVisible} onClose={hideProfileSheet} />
    </ProfileSheetContext.Provider>
  );
}

export function useProfileSheet() {
  const context = useContext(ProfileSheetContext);
  if (!context) {
    throw new Error('useProfileSheet must be used within a ProfileSheetProvider');
  }
  return context;
}