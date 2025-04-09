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

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  
    // Function to navigate to the Sign to Text/Speech screen
    

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
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call or process
  
      navigation.replace('Home'); // Navigate to GetStarted
    } catch (error) {
      Alert.alert('Sign In Failed', (error as Error).message);
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
            secureTextEntry
            autoComplete="password"
            inputStyle={inputStyles}
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
