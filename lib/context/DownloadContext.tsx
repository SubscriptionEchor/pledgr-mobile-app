import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { showToast } from '@/components/Toast';

export type DownloadedItem = {
  id: string;
  postId: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  name: string;
  description?: string;
  localUri: string;
  downloadedAt: string;
  size?: string;
  thumbnail?: string;
  creator?: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
};

type DownloadContextType = {
  downloadedItems: DownloadedItem[];
  isDownloading: Record<string, boolean>;
  downloadProgress: Record<string, number>;
  downloadItem: (item: Omit<DownloadedItem, 'localUri' | 'downloadedAt'>) => Promise<void>;
  removeDownload: (id: string) => Promise<void>;
  getDownloadedItems: (type?: 'audio' | 'image' | 'video') => DownloadedItem[];
};

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

export function DownloadProvider({ children }: { children: React.ReactNode }) {
  const [downloadedItems, setDownloadedItems] = useState<DownloadedItem[]>([]);
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    loadDownloadedItems();
  }, []);

  const loadDownloadedItems = async () => {
    try {
      const items = await AsyncStorage.getItem('downloadedItems');
      if (items) {
        setDownloadedItems(JSON.parse(items));
      }
    } catch (error) {
      console.error('Error loading downloaded items:', error);
    }
  };

  const saveDownloadedItems = async (items: DownloadedItem[]) => {
    try {
      await AsyncStorage.setItem('downloadedItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving downloaded items:', error);
    }
  };

  const downloadItem = async (item: Omit<DownloadedItem, 'localUri' | 'downloadedAt'>) => {
    try {
      setIsDownloading(prev => ({ ...prev, [item.id]: true }));
      setDownloadProgress(prev => ({ ...prev, [item.id]: 0 }));

      const fileUri = item.url;
      const fileName = `${item.id}_${Date.now()}.${item.type === 'audio' ? 'mp3' : item.type === 'video' ? 'mp4' : 'jpg'}`;
      const localUri = `${FileSystem.documentDirectory}downloads/${fileName}`;

      // Create downloads directory if it doesn't exist
      const downloadsDir = `${FileSystem.documentDirectory}downloads`;
      const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
      }

      const downloadResult = await FileSystem.downloadAsync(
        fileUri,
        localUri,
        {
          md5: true
        }
      );

      if (downloadResult.status === 200) {
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        const downloadedItem: DownloadedItem = {
          id: item.id,
          postId: item.postId,
          type: item.type,
          url: localUri,
          name: item.name,
          localUri: localUri,
          thumbnail: item.thumbnail,
          size: fileInfo.exists ? `${Math.round(fileInfo.size / 1024)}KB` : undefined,
          downloadedAt: new Date().toISOString()
        };

        setDownloadedItems(prev => [...prev, downloadedItem]);
        await saveDownloadedItems([...downloadedItems, downloadedItem]);
        setDownloadProgress(prev => ({ ...prev, [item.id]: 1 }));
        showToast.success('Download complete', `${item.name} has been downloaded successfully`);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Error downloading item:', error);
      showToast.error('Download failed', 'Failed to download the item. Please try again.');
    } finally {
      setIsDownloading(prev => ({ ...prev, [item.id]: false }));
      setDownloadProgress(prev => ({ ...prev, [item.id]: 0 }));
    }
  };

  const removeDownload = async (id: string) => {
    try {
      const item = downloadedItems.find(item => item.id === id);
      if (item) {
        await FileSystem.deleteAsync(item.localUri);
        const newItems = downloadedItems.filter(item => item.id !== id);
        setDownloadedItems(newItems);
        saveDownloadedItems(newItems);
        showToast.success('Item removed', 'The downloaded item has been removed');
      }
    } catch (error) {
      console.error('Error removing downloaded item:', error);
      showToast.error('Remove failed', 'Failed to remove the item. Please try again.');
    }
  };

  const getDownloadedItems = (type?: 'audio' | 'image' | 'video') => {
    if (!type) return downloadedItems;
    return downloadedItems.filter(item => item.type === type);
  };

  return (
    <DownloadContext.Provider
      value={{
        downloadedItems,
        isDownloading,
        downloadProgress,
        downloadItem,
        removeDownload,
        getDownloadedItems
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownload() {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error('useDownload must be used within a DownloadProvider');
  }
  return context;
} 