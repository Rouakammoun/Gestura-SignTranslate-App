import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TextInput,
  TouchableOpacity, Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ToastAndroid
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NavBar from '../components/NavBar';
import config from '../Config';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  GetStarted: undefined;
  Settings: undefined;
};

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface UserData {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  language: string | null;
  profileImage: string | null;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  language: string;
  profileImage: string;
}

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    language: 'English',
    profileImage: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const resetToLogin = useCallback(async () => {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [navigation]);

  const loadDataAndCheckConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = await config.getApiBaseUrl();
      setApiBaseUrl(url);
      
      // Try to ping server first
      try {
        await axios.get(`${url}/auth/ping`, { timeout: 5000 });
        setConnectionStatus('connected');
        
        // Only try to fetch fresh data if online
        const serverResponse = await axios.get(`${url}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
          },
          timeout: 10000
        });

        if (serverResponse.data?.user) {
          const updatedUser = serverResponse.data.user;
          setUserData(updatedUser);
          setFormData({
            name: updatedUser.name,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber || '',
            language: updatedUser.language || 'English',
            profileImage: updatedUser.profileImage || ''
          });
          await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.log('Server connection failed, using cached data');
        setConnectionStatus('failed');
      }

    } catch (error) {
      console.error('Initialization error:', error);
      setConnectionStatus('failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDataAndCheckConnection();
  }, [loadDataAndCheckConnection]);

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const uploadImageAndGetUrl = async (uri: string): Promise<string | null> => {
    if (!uri) return null;
  
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        resetToLogin();
        return null;
      }
  
      const filename = uri.split('/').pop() || `profile-${Date.now()}.jpg`;
      const filetype = filename.endsWith('.png') ? 'image/png' : 
                     filename.endsWith('.gif') ? 'image/gif' : 'image/jpeg';
  
      const formData = new FormData();
      formData.append('profileImage', {
        uri: uri,
        name: filename,
        type: filetype,
      } as any);
  
      setImageUploadProgress(1);
  
      const response = await axios.post(
        `${apiBaseUrl}/auth/upload-profile-image`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (event) => {
            if (event.total) {
              setImageUploadProgress(Math.round((event.loaded * 100) / event.total));
            }
          },
          timeout: 60000
        }
      );
  
      return response.data?.imageUrl || null;
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image');
      return null;
    } finally {
      setTimeout(() => setImageUploadProgress(0), 1500);
    }
  };

  const handleImagePick = async (useCamera: boolean) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant camera roll permissions');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setLocalImageUri(result.assets[0].uri);
        handleInputChange('profileImage', result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picking error:", error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSubmit = async () => {
    if (connectionStatus !== 'connected') {
      Alert.alert(
        'Offline Mode',
        'You need to be online to save changes. Please check your internet connection.',
        [
          { text: 'OK', onPress: () => {} },
          { text: 'Retry Connection', onPress: loadDataAndCheckConnection }
        ]
      );
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      setIsSaving(true);
      Keyboard.dismiss();

      // Upload image first if a new one was selected
      let profileImageUrl = formData.profileImage;
      if (localImageUri && localImageUri !== userData?.profileImage) {
        const uploadedUrl = await uploadImageAndGetUrl(localImageUri);
        if (uploadedUrl) {
          profileImageUrl = uploadedUrl;
        }
      }

      const payload = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber || null,
        language: formData.language || null,
        profileImage: profileImageUrl || null
      };

      const response = await axios.put(
        `${apiBaseUrl}/auth/update-profile`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
          }
        }
      );

      if (response.data?.user) {
        const updatedUser = response.data.user;
        setUserData(updatedUser);
        setFormData({
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber || '',
          language: updatedUser.language || 'English',
          profileImage: updatedUser.profileImage || ''
        });
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
        setLocalImageUri(null);
        
        ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Update error:', error);
      let errorMessage = 'Failed to update profile';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Update Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25596E" />
        <Text>Loading settings...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Could not load user data.</Text>
        <TouchableOpacity onPress={resetToLogin} style={styles.button}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageSourceUri = localImageUri || userData.profileImage;

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.container} 
          keyboardShouldPersistTaps="handled"
        >
          {connectionStatus === 'failed' && (
            <View style={styles.offlineBar}>
              <Text style={styles.offlineText}>Offline - Using cached data</Text>
              <TouchableOpacity 
                onPress={loadDataAndCheckConnection}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>Retry Connection</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.header}>
            <Text style={styles.profile}>Profile</Text>
            <TouchableOpacity onPress={() => {
              Alert.alert('Update Profile Picture', 'Choose an option', [
                { text: 'Choose from Gallery', onPress: () => handleImagePick(false) },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}>
              <View>
                <Image
                  source={imageSourceUri
                    ? { uri: imageSourceUri }
                    : require('../assets/default-profile.jpg')}
                  style={styles.profileImage}
                />
                {imageUploadProgress > 0 && imageUploadProgress < 100 && (
                  <View style={styles.progressOverlay}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.progressText}>{imageUploadProgress}%</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>My Information</Text>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Full Name:</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter your full name"
                maxLength={50}
              />
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formData.email}
                editable={false}
              />
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Phone Number:</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange('phoneNumber', text)}
                placeholder="Enter phone number (optional)"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>App Language:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.language}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange('language', value)}
                  prompt="Select Language"
                >
                  <Picker.Item label="English" value="English" />
                  <Picker.Item label="French" value="French" />
                  <Picker.Item label="Arabic" value="Arabic" />
                </Picker>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[
                  styles.button, 
                  { flex: 1, marginRight: 10 },
                  (connectionStatus !== 'connected' || isSaving) && styles.buttonDisabled
                ]}
                onPress={handleSubmit}
                disabled={connectionStatus !== 'connected' || isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
              
              {connectionStatus !== 'connected' && (
                <TouchableOpacity
                  style={[styles.button, { flex: 0.4 }]}
                  onPress={loadDataAndCheckConnection}
                >
                  <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F8F7',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 25 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  profile: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#25596E',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#00819E',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#25596E',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  infoItem: {
    marginBottom: 18,
  },
  label: {
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CED4DA',
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#E9ECEF',
    color: '#6C757D',
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CED4DA',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  button: {
    paddingVertical: 14,
    backgroundColor: '#00819E',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#A0D2DB',
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  offlineBar: {
    backgroundColor: '#ffc107',
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  offlineText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 13,
  },
  retryButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#ffc107',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;  