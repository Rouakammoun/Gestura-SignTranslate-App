import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have Ionicons installed

const ModeScreen = () => {
  // Function to log button presses
  const handleButtonPress = (buttonName) => {
    console.log(`${buttonName} button pressed`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Choose a Mode</Text>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        {/* Upload Video Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleButtonPress('Upload Video')}>
          <Text style={styles.buttonText}>Upload Video</Text>
        </TouchableOpacity>

        {/* Record Video Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleButtonPress('Record Video')}>
          <Text style={styles.buttonText}>Record Video</Text>
        </TouchableOpacity>
      </View>

      {/* Navbar with Icons at the bottom */}
      <View style={styles.navbarBottom}>
        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Home Button Pressed')}>
          <Ionicons name="home-outline" size={30} color="#333" /> {/* Home Icon */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Profile Button Pressed')}>
          <Ionicons name="person-outline" size={30} color="#333" /> {/* Profile Icon */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Feedback Button Pressed')}>
          <Ionicons name="chatbubble-outline" size={30} color="#333" /> {/* Feedback Icon */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87C4A5', // Background color for the whole screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#87C4A5', // Title text color, same as background
    fontSize: 30, // Increased font size
    marginTop: 50, // Pushed lower from the top
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 100,
  },
  button: {
    backgroundColor: '#25596E', // Button color
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbarBottom: {
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

export default ModeScreen;
