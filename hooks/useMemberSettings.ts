import { useState } from 'react';
import { useUserContext } from '@/lib/context/UserContext';
import { memberAPI } from '@/lib/api/member';
import { commonAPI } from '@/lib/api/common';
import { showToast } from '@/components/Toast';

export function useMemberSettings() {
  const { memberSettings, setMemberSettings, setLocationInfo } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocationInfo = async (countryCode: string, stateCode: string) => {
    try {
      const response = await commonAPI.getLocationInfo(countryCode, stateCode);
      const newLocationInfo = {
        countryName: response.data.country.name,
        stateName: response.data.state.name,
      };
      setLocationInfo(newLocationInfo);
      return newLocationInfo;
    } catch (error) {
      console.error('Error fetching location info:', error);
      return null;
    }
  };

  const fetchMemberSettings = async () => {
    if (memberSettings) return; // Don't fetch if we already have settings

    setIsLoading(true);
    try {
      const response = await memberAPI.getCurrentMember();
      const settings = response.data.settings;
      setMemberSettings(settings);

      // Only fetch location info if both country and state exist
      const { country, state } = settings.profile || {};
      if (country && state) {
        await fetchLocationInfo(country, state);
      }

      return settings;
    } catch (error) {
      console.error('Error fetching member settings:', error);
      showToast.error('Failed to load settings', 'Please try again later');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemberSettings = async (newSettings: Partial<typeof memberSettings>) => {
    if (!memberSettings) return;

    setIsLoading(true);
    try {
      const response = await memberAPI.updateMemberSettings(newSettings);
      const updatedSettings = response.data.settings;
      setMemberSettings(updatedSettings);

      // Only fetch location info if profile was updated with new country/state
      if (newSettings.profile?.country && newSettings.profile?.state) {
        await fetchLocationInfo(
          newSettings.profile.country,
          newSettings.profile.state
        );
      }

      showToast.success('Settings updated', 'Your changes have been saved');
      return updatedSettings;
    } catch (error) {
      console.error('Error updating member settings:', error);
      showToast.error('Failed to update settings', 'Please try again later');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    memberSettings,
    isLoading,
    fetchMemberSettings,
    updateMemberSettings
  };
}