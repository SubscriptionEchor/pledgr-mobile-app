import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Smartphone, Globe, Clock, LogOut } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useState } from 'react';
import { showToast } from '@/components/Toast';

interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  lastActive: string;
  isCurrentDevice: boolean;
}

interface DeviceManagementModalProps {
  visible: boolean;
  onClose: () => void;
  devices: Device[];
  onLogoutDevice: (deviceId: string) => void;
  onLogoutAllDevices: () => void;
}

export function DeviceManagementModal({ 
  visible, 
  onClose,
  devices,
  onLogoutDevice,
  onLogoutAllDevices
}: DeviceManagementModalProps) {
  const { colors } = useTheme();
  const [logoutConfirmation, setLogoutConfirmation] = useState<{
    visible: boolean;
    deviceId?: string;
    deviceName?: string;
  }>({
    visible: false,
  });
  const [logoutAllConfirmation, setLogoutAllConfirmation] = useState(false);

  const handleLogoutClick = (device: Device) => {
    setLogoutConfirmation({
      visible: true,
      deviceId: device.id,
      deviceName: device.name,
    });
  };

  const handleLogoutConfirm = () => {
    if (logoutConfirmation.deviceId) {
      onLogoutDevice(logoutConfirmation.deviceId);
      showToast.success(
        'Device logged out',
        'The device has been successfully logged out'
      );
    }
    setLogoutConfirmation({ visible: false });
  };

  const handleLogoutAllClick = () => {
    setLogoutAllConfirmation(true);
  };

  const handleLogoutAllConfirm = () => {
    onLogoutAllDevices();
    setLogoutAllConfirmation(false);
    showToast.success(
      'All devices logged out',
      'All other devices have been logged out successfully'
    );
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Device Management</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.warningBox, { backgroundColor: `${colors.primary}15` }]}>
            <Smartphone size={24} color={colors.primary} />
            <Text style={[styles.warningText, { color: colors.textPrimary }]}>
              Review and manage all devices that are currently signed in to your account. You can log out of any device remotely.
            </Text>
          </View>

          <View style={styles.deviceList}>
            {devices.map((device) => (
              <View 
                key={device.id}
                style={[styles.deviceItem, { backgroundColor: colors.surface }]}
              >
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceHeader}>
                    <Text style={[styles.deviceName, { color: colors.textPrimary }]}>
                      {device.name}
                    </Text>
                    {device.isCurrentDevice && (
                      <View style={[styles.currentDevice, { backgroundColor: colors.success }]}>
                        <Text style={[styles.currentDeviceText, { color: colors.buttonText }]}>
                          Current Device
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.deviceDetails}>
                    <View style={styles.detailItem}>
                      <Globe size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {device.location}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Clock size={16} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                        {device.lastActive}
                      </Text>
                    </View>
                  </View>
                </View>

                {!device.isCurrentDevice && (
                  <TouchableOpacity 
                    onPress={() => handleLogoutClick(device)}
                    style={[styles.logoutButton, { backgroundColor: `${colors.error}15` }]}
                  >
                    <LogOut size={20} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <Button 
            label="Log Out All Other Devices" 
            onPress={handleLogoutAllClick}
            variant="error"
          />
        </ScrollView>

        <ConfirmationModal
          visible={logoutConfirmation.visible}
          onClose={() => setLogoutConfirmation({ visible: false })}
          onConfirm={handleLogoutConfirm}
          title="Log out device?"
          description={`Are you sure you want to log out from ${logoutConfirmation.deviceName}? This will end the session on this device.`}
          confirmLabel="Log out"
          confirmVariant="error"
        />

        <ConfirmationModal
          visible={logoutAllConfirmation}
          onClose={() => setLogoutAllConfirmation(false)}
          onConfirm={handleLogoutAllConfirm}
          title="Log out all other devices?"
          description="This will end all sessions except for your current device. Are you sure you want to continue?"
          confirmLabel="Log out"
          confirmVariant="error"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  deviceList: {
    gap: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  deviceInfo: {
    flex: 1,
    gap: 8,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  currentDevice: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentDeviceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deviceDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});