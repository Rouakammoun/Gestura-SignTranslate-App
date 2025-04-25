import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TextInput,
  TouchableOpacity, Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform
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
};

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface UserData {
  name: string;
  email: string;
  phoneNumber: string;
  language: string;
  profileImage: string | null;
}

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phoneNumber: '',
    language: 'English',
    profileImage: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const url = await config.getApiBaseUrl();
        setApiBaseUrl(url);
        setIsConnected(true);
        const savedData = await AsyncStorage.getItem('userData');
        if (savedData) setUserData(JSON.parse(savedData));
      } catch (error) {
        console.error('Connection error:', error);
        setIsConnected(false);
        Alert.alert('Connection Error', 'Could not connect to the server. Using offline mode.');
      }
    };
    initializeData();
  }, []);

  const uploadImage = async (uri: string) => {
    if (!apiBaseUrl) {
      console.log('API base URL not set');
      return null;
    }
  
    try {
      console.log('Starting image upload from:', uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Image blob created');
  
      const formData = new FormData();
      formData.append('profileImage', blob, 'profile.jpg');
  
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return null;
      }
  
      console.log('Uploading image to server...');
      const uploadResponse = await axios.post(`${apiBaseUrl}/upload-profile-image`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded * 100) / (event.total || 1));
          setImageUploadProgress(progress);
        },
      });
  
      console.log('Upload response:', uploadResponse.data);
      return uploadResponse.data.imageUrl;
  
    } catch (error) {
      console.error('Upload error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      return null;
    } finally {
      setImageUploadProgress(0);
    }
  };
  
  const handleImagePick = async (useCamera: boolean) => {
    const { status } = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', `Please allow access to ${useCamera ? 'camera' : 'photos'}`);
      return;
    }

    try {
      const result = await (useCamera
        ? ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 })
        : ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 }));

      if (!result.canceled && result.assets?.[0]?.uri) {
        setUserData(prev => ({ ...prev, profileImage: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update image');
    }
  };

  const resetToLogin = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
  
    if (!userData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return;
    }
  
    setIsLoading(true);
    
    try {
      // 1. First upload image if needed
      let imageUrl = userData.profileImage;
      
      if (userData.profileImage && userData.profileImage.startsWith('file://')) {
        console.log('Attempting to upload image...');
        const uploadedUrl = await uploadImage(userData.profileImage);
        
        if (!uploadedUrl) {
          throw new Error('Image upload failed');
        }
        
        imageUrl = uploadedUrl;
        console.log('Image uploaded successfully:', imageUrl);
      }
  
      // 2. Then update profile
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
  
      console.log('Attempting profile update with:', {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        language: userData.language,
        profileImage: imageUrl
      });
  
      const response = await axios.put(`${apiBaseUrl}/update-profile`,  {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        language: userData.language,
        profileImage: imageUrl
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });
  
      console.log('Update successful, response:', response.data);
  
      const updatedUserData = {
        ...userData,
        ...response.data.user,
        profileImage: imageUrl
      };
  
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
  
      Alert.alert('Success', 'Profile updated successfully!');
  
    } catch (error: any) {
      console.error('Update failed:', error);
      
      let message = 'Profile update failed';
      if (error.response) {
        message = error.response.data?.error || message;
        if (error.response.data?.code) {
          switch (error.response.data.code) {
            case 'invalid_auth':
              message = 'Session expired. Please login again.';
              resetToLogin();
              break;
            case 'missing_name':
              message = 'Name is required';
              break;
          }
        }
      }
      
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          {!isConnected && (
            <View style={styles.offlineBar}>
              <Text style={styles.offlineText}>Offline - Changes will be saved locally</Text>
            </View>
          )}

          <View style={styles.header}>
            <Text style={styles.profile}>Profile</Text>
            <TouchableOpacity onPress={() => {
              Alert.alert('Update Profile Picture', 'Choose an option', [
                { text: 'Take Photo', onPress: () => handleImagePick(true) },
                { text: 'Choose from Gallery', onPress: () => handleImagePick(false) },
                { text: 'Cancel', style: 'cancel' },
              ]);
            }}>
              <View>
                <Image
                  source={userData.profileImage
                    ? { uri: userData.profileImage }
                    : require('../assets/default-profile.jpg')}
                  style={styles.profileImage}
                />
                {imageUploadProgress > 0 && imageUploadProgress < 100 && (
  <View style={styles.progressContainer}>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${imageUploadProgress}%` }]} />
    </View>
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
                value={userData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Enter your full name"
                maxLength={50}
              />
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userData.email}
                editable={false}
              />
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Phone Number:</Text>
              <TextInput
                style={styles.input}
                value={userData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>App Language:</Text>
              <Picker
                selectedValue={userData.language}
                style={styles.picker}
                onValueChange={(value) => handleChange('language', value)}
              >
                <Picker.Item label="English" value="English" />
                <Picker.Item label="French" value="French" />
                <Picker.Item label="Arabic" value="Arabic" />
              </Picker>
            </View>

            <TouchableOpacity
              style={[styles.button, (!apiBaseUrl || isLoading) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!apiBaseUrl || isLoading}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87C4A5',
    padding: 20,
    paddingTop: 40,
  },
 
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profile: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#25596E',
  },
  infoItem: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  disabledInput: {
    color: '#888',
  },  
  picker: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#25596E',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#7a9cb1',
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  offlineBar: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold'
  },
  progressBar: {
    height: 5,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default SettingsScreen;