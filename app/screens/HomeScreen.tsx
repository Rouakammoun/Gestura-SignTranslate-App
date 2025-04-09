import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import { RootStackParamList } from '../navigation/types';
import NavBar from '../components/NavBar';

// Define the type for navigation props
type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList, // RootStackParamList should be defined elsewhere, defining all the screen names in your navigation
  'Home' // This is the current screen name
>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Initialize navigation object with types

  // Function to navigate to the Sign to Text/Speech screen
  const goToSignToText = () => {
    navigation.navigate('ChooseLanguage'); // Replace with your actual screen name
  };

  // Function to navigate to the Text/Speech to Sign screen
  const goToTextToSign = () => {
    navigation.navigate('TextOrSpeechToSign'); // Replace with your actual screen name
  };

  // Function to navigate to the Video Translation screen
  const goToVideoTranslation = () => {
    navigation.navigate('VideoTranslation'); // Replace with your actual screen name
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.circleIconContainer}>
            <Image
              source={require('../assets/Hand_signs-removebg-preview.png')}
              style={styles.handIcon}
            />
          </View>
          <Text style={styles.title}>Home Page</Text>
        </View>
      </View>

      {/* Gradient Background Container */}
      <LinearGradient colors={['#88C5A6', '#396F7A']} style={styles.gradientContainer}>
        {/* Service Bar */}
        <View style={styles.serviceBar}>
          <Text style={styles.serviceText}>Three Main Services</Text>
        </View>

        {/* Buttons for navigation */}
        <TouchableOpacity style={styles.button} onPress={goToSignToText}>
          <View style={styles.circle} />
          <Text style={styles.buttonText}>Sign to Text/Speech</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={goToTextToSign}>
          <View style={styles.circle} />
          <Text style={styles.buttonText}>Text/Speech to Sign</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={goToVideoTranslation}>
          <View style={styles.circle} />
          <Text style={styles.buttonText}>Video Translation</Text>
        </TouchableOpacity>

        {/* Navigation Bar */}
        <NavBar />
      </LinearGradient>
    </View>
  );
};

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    height: '17.8%',
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleIconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 75,
    borderWidth: 15,
    borderColor: '#88C5A6',
    padding: 20,
    marginRight: -60,
    marginLeft: 0,
    marginTop: 30,
    marginBottom: -20,
    position: 'absolute',
    left: -180,
    top: -50,
    zIndex: 1,
  },
  handIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B3B3B',
    right: -150,
    top: 20,
    position: 'absolute',
  },
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  serviceBar: {
    backgroundColor: '#00819E',
    borderRadius: 20,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 20,
  },
  serviceText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    top: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00819E',
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginVertical: 20,
    width: '90%',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    marginRight: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
