import { createContext, useContext, useState } from 'react';

interface BottomSheetContextType {
  isSheetVisible: boolean;
  setSheetVisible: (visible: boolean) => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
  const [isSheetVisible, setSheetVisible] = useState(false);

  return (
    <BottomSheetContext.Provider value={{ isSheetVisible, setSheetVisible }}>
      {children}
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
}