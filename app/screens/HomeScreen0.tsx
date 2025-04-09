import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types'; // Adjust this path if needed

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen0 = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/gesturalogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          {/* SIGN IN (Blue Button) */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.buttonText}>SIGN IN</Text>
          </TouchableOpacity>

          {/* SIGN UP (White Button with Blue Border) */}
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signUpButtonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  buttonsContainer: {
    width: '80%',
    maxWidth: 300,
    marginTop: 20,
  },
  signInButton: {
    backgroundColor: '#25596E',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#89C6A7',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signUpButtonText: {
    color: '#25596E',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default HomeScreen0;
