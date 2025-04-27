import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { InputField } from '../components/InputField';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof credentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async () => {
    if (!credentials.email || !credentials.password) return; // Ensure fields are filled

    try {
      setIsLoading(true); // Set loading state
      console.log('Signing in with:', credentials);

      // Sending data to the backend
      const response = await fetch('http://192.168.1.186:5000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      console.log(data); // Log the server response

      if (response.ok) {
        // Successful login
        console.log('Login successful:', data);
        await AsyncStorage.setItem('token', data.token);
        console.log('Token stored!');
        navigation.replace('Home'); // Navigate to the Home screen after successful login
      } else {
        // If the login fails, show the error message
        Alert.alert('Login Failed', data.error || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const inputStyles: TextStyle = {
    marginBottom: 20,
    backgroundColor: 'white',
    borderColor: '#89C6A7',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Gestura</Text>

          <InputField
            placeholder="Email"
            value={credentials.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            inputStyle={inputStyles}
          />

<InputField
  placeholder="Password"
  value={credentials.password}
  onChangeText={(text) => handleChange('password', text)}
  secureTextEntry={!showPassword}
  autoComplete="password"
  inputStyle={inputStyles}
  rightIcon={(
    <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
      <Ionicons
        name={showPassword ? 'eye-off' : 'eye'}
        size={24}
        color="#00819E"
      />
    </TouchableOpacity>
  )}
/>

          <View style={styles.divider} />

          <TouchableOpacity
            style={[styles.button, (!credentials.email || !credentials.password) && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={!credentials.email || !credentials.password || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpLink}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#25596E',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 25,
    width: '100%',
  },
  button: {
    backgroundColor: '#00819E',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    color: '#25596E',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
