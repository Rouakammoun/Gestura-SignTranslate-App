import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter hook

const ProfileScreen = () => {
  const router = useRouter();  // Initialize the router

  // Function to handle navigation to SettingsScreen
  const navigateToSettings = () => {
    router.push('/settings');  // Navigate to the Settings screen
  };

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/taswirti.jpg')} // Ensure this path is correct
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

      {/* Navbar with Custom Icons */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Home Button Pressed')}>
          <Image source={require('../../assets/images/home-icon.jpg')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Profile Button Pressed')}>
          <Image source={require('../../assets/images/profile-icon.jpg')} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Feedback Button Pressed')}>
          <Image source={require('../../assets/images/feedback-icon.jpg')} style={styles.icon} />
        </TouchableOpacity>
      </View>
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
