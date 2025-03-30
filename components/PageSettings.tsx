import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react-native';
import { CountryPicker } from '@/components/CountryPicker';

export function PageSettings() {
  const { colors, fonts, fontSize } = useTheme();
  const [form, setForm] = useState({
    firstName: '',
    surname: '',
    country: '',
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [settings, setSettings] = useState({
    earningsVisibility: 'private',
    membershipDetails: 'private',
    membershipOptions: 'all',
    comments: 'allow',
    adultContent: false,
  });

  const handleCountrySelect = (country: string) => {
    setForm(prev => ({ ...prev, country }));
    setShowCountryPicker(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textPrimary, fontFamily: fonts.semibold, includeFontPadding: false }]}>
            Legal first name
          </Text>
          <TextInput
            value={form.firstName}
            onChangeText={(text) => setForm(prev => ({ ...prev, firstName: text }))}
            placeholder="Enter your first name"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                includeFontPadding: false
              }
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textPrimary, fontFamily: fonts.semibold, includeFontPadding: false }]}>
            Legal surname
          </Text>
          <TextInput
            value={form.surname}
            onChangeText={(text) => setForm(prev => ({ ...prev, surname: text }))}
            placeholder="Enter your surname"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                fontFamily: fonts.regular,
                includeFontPadding: false
              }
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.textPrimary, fontFamily: fonts.semibold, includeFontPadding: false }]}>
            Country of residence
          </Text>
          <TouchableOpacity
            onPress={() => setShowCountryPicker(true)}
            style={[
              styles.input,
              styles.countrySelector,
              { backgroundColor: colors.surface }
            ]}>
            <Text style={[
              styles.countryText,
              {
                color: form.country ? colors.textPrimary : colors.textSecondary,
                fontFamily: fonts.regular,
                includeFontPadding: false
              }
            ]}>
              {form.country || 'Select a country'}
            </Text>
            <ChevronDown size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[
            styles.hint,
            {
              color: colors.textSecondary,
              fontFamily: fonts.regular,
              fontSize: fontSize.sm,
              includeFontPadding: false
            }
          ]}>
            This information is used for tax purposes
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[
            styles.cardTitle,
            {
              color: colors.textPrimary,
              fontFamily: fonts.semibold,
              fontSize: fontSize.lg,
              includeFontPadding: false
            }
          ]}>
            Visibility Settings
          </Text>

          <View style={styles.settingGroup}>
            <View style={styles.settingHeader}>
              <Text style={[
                styles.settingTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  includeFontPadding: false
                }
              ]}>
                Earnings visibility
              </Text>
              <Text style={[
                styles.settingDescription,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Choose whether to display your earnings publicly
              </Text>
            </View>

            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSettings(prev => ({ ...prev, earningsVisibility: 'private' }))}>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    { borderColor: colors.primary }
                  ]}>
                    {settings.earningsVisibility === 'private' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[
                      styles.radioLabel,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        includeFontPadding: false
                      }
                    ]}>
                      Keep private
                    </Text>
                    <Text style={[
                      styles.radioDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Only you can see your earnings
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSettings(prev => ({ ...prev, earningsVisibility: 'public' }))}>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    { borderColor: colors.primary }
                  ]}>
                    {settings.earningsVisibility === 'public' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[
                      styles.radioLabel,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        includeFontPadding: false
                      }
                    ]}>
                      Make public
                    </Text>
                    <Text style={[
                      styles.radioDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Everyone can see your earnings
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingGroup}>
            <View style={styles.settingHeader}>
              <Text style={[
                styles.settingTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  includeFontPadding: false
                }
              ]}>
                Membership Details
              </Text>
              <Text style={[
                styles.settingDescription,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Control who can see your membership details
              </Text>
            </View>

            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSettings(prev => ({ ...prev, membershipDetails: 'private' }))}>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    { borderColor: colors.primary }
                  ]}>
                    {settings.membershipDetails === 'private' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[
                      styles.radioLabel,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        includeFontPadding: false
                      }
                    ]}>
                      Keep private
                    </Text>
                    <Text style={[
                      styles.radioDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Only you can see membership details
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSettings(prev => ({ ...prev, membershipDetails: 'public' }))}>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    { borderColor: colors.primary }
                  ]}>
                    {settings.membershipDetails === 'public' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[
                      styles.radioLabel,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        includeFontPadding: false
                      }
                    ]}>
                      Make public
                    </Text>
                    <Text style={[
                      styles.radioDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Everyone can see membership details
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingGroup}>
            <View style={styles.settingHeader}>
              <Text style={[
                styles.settingTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  includeFontPadding: false
                }
              ]}>
                Membership Options
              </Text>
              <Text style={[
                styles.settingDescription,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Choose which membership options to display
              </Text>
            </View>

            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSettings(prev => ({ ...prev, membershipOptions: 'all' }))}>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    { borderColor: colors.primary }
                  ]}>
                    {settings.membershipOptions === 'all' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[
                      styles.radioLabel,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        includeFontPadding: false
                      }
                    ]}>
                      Show free and paid options
                    </Text>
                    <Text style={[
                      styles.radioDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Display all membership tiers
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSettings(prev => ({ ...prev, membershipOptions: 'paid' }))}>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    { borderColor: colors.primary }
                  ]}>
                    {settings.membershipOptions === 'paid' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[
                      styles.radioLabel,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        includeFontPadding: false
                      }
                    ]}>
                      Show paid options only
                    </Text>
                    <Text style={[
                      styles.radioDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Hide free membership tier
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingGroup}>
            <View style={styles.settingHeader}>
              <Text style={[
                styles.settingTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  includeFontPadding: false
                }
              ]}>
                Comment access
              </Text>
              <Text style={[
                styles.settingDescription,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                Manage comment settings for your page
              </Text>
            </View>

            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSettings(prev => ({ ...prev, comments: 'allow' }))}>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    { borderColor: colors.primary }
                  ]}>
                    {settings.comments === 'allow' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[
                      styles.radioLabel,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        includeFontPadding: false
                      }
                    ]}>
                      Allow comments
                    </Text>
                    <Text style={[
                      styles.radioDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Members can comment on your posts
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSettings(prev => ({ ...prev, comments: 'disable' }))}>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    { borderColor: colors.primary }
                  ]}>
                    {settings.comments === 'disable' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <View style={styles.radioContent}>
                    <Text style={[
                      styles.radioLabel,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.medium,
                        includeFontPadding: false
                      }
                    ]}>
                      Turn off comments
                    </Text>
                    <Text style={[
                      styles.radioDescription,
                      {
                        color: colors.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: fontSize.sm,
                        includeFontPadding: false
                      }
                    ]}>
                      Disable comments on all posts
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.adultContentSection, { backgroundColor: colors.surface }]}>
          <View style={styles.adultContentHeader}>
            <View>
              <Text style={[
                styles.adultContentTitle,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.semibold,
                  fontSize: fontSize.lg,
                  includeFontPadding: false
                }
              ]}>
                Adult content
              </Text>
              <Text style={[
                styles.adultContentDescription,
                {
                  color: colors.textSecondary,
                  fontFamily: fonts.regular,
                  fontSize: fontSize.sm,
                  includeFontPadding: false
                }
              ]}>
                My work isn't suitable for people under 18
              </Text>
            </View>
            <Switch
              value={settings.adultContent}
              onValueChange={(value) => setSettings(prev => ({ ...prev, adultContent: value }))}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.buttonText}
            />
          </View>
        </View>
      </View>

      <CountryPicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={handleCountrySelect}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryText: {
    fontSize: 16,
  },
  hint: {
    marginTop: 4,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    padding: 24,
  },
  cardTitle: {
    marginBottom: 24,
  },
  settingGroup: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingHeader: {
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    lineHeight: 20,
  },
  radioGroup: {
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 2,
  },
  radioDescription: {
    lineHeight: 20,
  },
  adultContentSection: {
    borderRadius: 16,
    padding: 24,
  },
  adultContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adultContentTitle: {
    marginBottom: 4,
  },
  adultContentDescription: {
    lineHeight: 20,
  },
});