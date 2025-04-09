import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';  // Make sure to import your navigation types
import NavBar from '../components/NavBar';

// Define types for navigation props
type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = () => {
  const navigation = useNavigation<Props['navigation']>();

  // Navigate to Settings screen
  const navigateToSettings = () => {
    navigation.navigate('Settings'); // Make sure "Settings" is a valid screen in your stack
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/taswirti.jpg')}
          style={styles.profileImage}
        />
      </View>

      {/* Full Name */}
      <Text style={styles.fullName}>Ahmed Chakroun</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={navigateToSettings}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>My Avatar</Text>
      </TouchableOpacity>

  
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87C4A5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  imageContainer: {
    marginTop: 50,
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  fullName: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
  },
  navbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    elevation: 5,
  },
  navButton: {
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default ProfileScreen;
