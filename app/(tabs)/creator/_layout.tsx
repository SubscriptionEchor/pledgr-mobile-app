import React, { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Library, Wallet, Menu, Plus, BookOpen, User, BarChart, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { View, TouchableOpacity, Modal, Text, StyleSheet } from 'react-native';

export default function CreatorTabLayout() {
    const { colors, fonts, fontSize } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();

    return (
        <>
            <Tabs
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopColor: colors.border,
                        height: 60,
                        paddingBottom: 8,
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarLabelStyle: {
                        fontFamily: fonts.medium,
                        fontSize: 10,
                        marginTop: 4,
                    },
                })}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="library"
                    options={{
                        title: 'Library',
                        tabBarIcon: ({ color }) => <Library size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="add"
                    options={{
                        title: '',
                        tabBarIcon: ({ focused }) => (
                            <View style={{
                                backgroundColor: colors.primary,
                                borderRadius: 28,
                                width: 56,
                                height: 56,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: -24,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.18,
                                shadowRadius: 6,
                                elevation: 8,
                            }}>
                                <Plus color="#fff" size={32} />
                            </View>
                        ),
                        tabBarButton: (props) => (
                            <TouchableOpacity
                                onPress={() => setModalVisible(true)}
                                style={[props.style, { alignItems: 'center', justifyContent: 'center' }]}
                            >
                                {props.children}
                            </TouchableOpacity>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="insights"
                    options={{
                        title: 'Insights',
                        tabBarIcon: ({ color }) => <BarChart size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="menu"
                    options={{
                        title: 'Menu',
                        tabBarIcon: ({ color }) => <Menu size={24} color={color} />,
                    }}
                />
            </Tabs>

            {/* Add Options Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary, fontFamily: fonts.bold }]}>
                                Create New
                            </Text>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <X size={24} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            <View style={styles.optionContainer}>
                                <TouchableOpacity 
                                    style={[styles.actionButton, { 
                                        borderColor: colors.primary,
                                        borderWidth: 1,
                                        backgroundColor: 'transparent'
                                    }]}
                                    onPress={() => {
                                        setModalVisible(false);
                                        // Navigate to create post screen in screens directory
                                        router.push('/screens/creator/create-post');
                                    }}
                                >
                                    <Text style={[styles.buttonText, { color: colors.primary, fontFamily: fonts.medium }]}>
                                        Create Post
                                    </Text>
                                </TouchableOpacity>
                                <Text style={[styles.descriptionText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                                    Share updates with your audience
                                </Text>
                            </View>
                            
                            <View style={styles.optionContainer}>
                                <TouchableOpacity 
                                    style={[styles.actionButton, { 
                                        borderColor: colors.primary,
                                        borderWidth: 1,
                                        backgroundColor: 'transparent'
                                    }]}
                                    onPress={() => {
                                        setModalVisible(false);
                                        // Navigate to create product screen in screens directory
                                        router.push('/screens/creator/create-product');
                                    }}
                                >
                                    <Text style={[styles.buttonText, { color: colors.primary, fontFamily: fonts.medium }]}>
                                        Create Product
                                    </Text>
                                </TouchableOpacity>
                                <Text style={[styles.descriptionText, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                                    Add products to your shop
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
    },
    closeButton: {
        padding: 5,
    },
    buttonContainer: {
        gap: 20,
    },
    optionContainer: {
        width: '100%',
        marginBottom: 10,
    },
    actionButton: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        fontSize: 16,
    },
    descriptionText: {
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    }
});