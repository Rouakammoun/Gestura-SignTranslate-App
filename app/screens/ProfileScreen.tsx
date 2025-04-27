import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';
import NavBar from '../components/NavBar';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('sending auth header:', token);
        if (!token) throw new Error('Not authenticated');
        const res = await fetch('http://192.168.1.186:5000/profile', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error();
        const { name, profile_image } = await res.json();
        if (isActive) {
          setFullName(name);
          setPhotoUri(profile_image || null);
        }
      } catch {
        Alert.alert('Error', 'Could not load profile');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    if (isFocused) loadProfile();
    return () => {
      isActive = false;
    };
  }, [isFocused]);

  const onPressAvatar = () =>
    Alert.alert('Profile Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: () => pickImage(true) },
      { text: 'Choose from Library', onPress: () => pickImage(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const pickImage = async (fromCamera: boolean) => {
    try {
      const perm =
        fromCamera
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        return Alert.alert('Permissions', 'Permission is required.');
      }

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: MediaTypeOptions.Images })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: MediaTypeOptions.Images });

      if (result.canceled) return;
      const asset = result.assets[0];
      const localUri = asset.uri;
      const filename = localUri.split('/').pop()!;
      const ext = filename.split('.').pop()!;
      const form = new FormData();
      form.append(
        'photo',
        { uri: localUri, name: `photo.${ext}`, type: `image/${ext}` } as any
      );

      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const uploadRes = await fetch('http://192.168.1.186:5000/profile/photo', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: form,
      });
      const data = await uploadRes.json();
      if (!uploadRes.ok) {
        Alert.alert('Upload failed', data.error || 'Unknown error');
      } else {
        setPhotoUri(data.image_url);
      }
    } catch {
      Alert.alert('Error', 'Could not update photo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={onPressAvatar}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.fullName}>{fullName || 'Anonymous User'}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>My Avatar</Text>
      </TouchableOpacity>

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#87C4A5', alignItems: 'center', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { marginTop: 50, marginBottom: 20 },
  profileImage: { width: 200, height: 200, borderRadius: 100 },
  placeholder: { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#666', fontSize: 18 },
  fullName: { fontSize: 35, fontWeight: 'bold', color: '#fff', marginBottom: 40 },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: { fontSize: 18, color: '#333' },
});
