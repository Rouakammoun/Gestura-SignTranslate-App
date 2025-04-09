import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Correct import from the new package
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the navbar
import NavBar from '../components/NavBar';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  language: string;
}

const SettingsScreen = () => {
  // State initialized with default values
  const [userData, setUserData] = useState<UserData>({
    firstName: 'Ahmed',
    lastName: 'Chakroun',
    email: 'ahmed@example.com',
    phoneNumber: '+21612345678',
    language: 'English', // Default language set to English
  });

  // Function to handle submission (here, displaying an alert)
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/update-user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
      if (result.success) {
        alert('Profile updated successfully!');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Function to handle state change for user data
  const handleChange = (key: keyof UserData, value: string) => {
    setUserData({ ...userData, [key]: value });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.profile}>Profile</Text>
          <Image
            source={require('../assets/taswirti.jpg')} // Replace with your local image or use a valid URL
            style={styles.profileImage}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>My Information</Text>

          {/* First Name Input */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>First Name:</Text>
            <TextInput
              style={styles.input}
              value={userData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              placeholder="First Name"
            />
          </View>

          {/* Last Name Input */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>Last Name:</Text>
            <TextInput
              style={styles.input}
              value={userData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              placeholder="Last Name"
            />
          </View>

          {/* Email Input */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              value={userData.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>

          {/* Language Selection (Dropdown) */}
          <View style={styles.infoItem}>
            <Text style={styles.label}>Application Language:</Text>
            <Picker
              selectedValue={userData.language}
              style={styles.picker}
              onValueChange={(itemValue) => handleChange('language', itemValue)}
            >
              <Picker.Item label="English" value="English" />
              <Picker.Item label="French" value="French" />
              <Picker.Item label="Arabic" value="Arabic" />
            </Picker>
          </View>

          {/* Custom Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Navbar with Icons */}
      <NavBar />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87C4A5', // Updated background color
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profile: {
    fontSize: 32, // Larger font size for "Profile"
    fontWeight: 'bold',
    color: '#fff', // White text for contrast
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#87C4A5', // Same color as the background
    borderRadius: 30, // Make the button rounded
    alignItems: 'center',
    marginBottom: 15, // More space between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignSelf: 'center', // Center the button
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text to contrast with the button background
  },
  navbar: {
    position: 'absolute',
    bottom: 20, // Adjust this to get closer or farther from the bottom
    left: 20, // Margin from the left side
    right: 20, // Margin from the right side
    backgroundColor: '#fff',
    borderRadius: 25, // Make the navbar rounded
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10, // Space inside the navbar
    elevation: 5, // Adds a little shadow for effect
  },
  navButton: {
    alignItems: 'center',
  },
});

export default SettingsScreen;
