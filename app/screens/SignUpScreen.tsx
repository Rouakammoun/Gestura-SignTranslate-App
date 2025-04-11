import { useState } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground, TouchableOpacity, TextStyle } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // Your RootStackParamList file
import { InputField } from '../components/InputField';
import NavBar from '../components/NavBar'; // Import your NavBar component

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handle form field changes
  const handleChange = (name: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission and backend API call
  const handleSubmit = async () => {
    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    // Check if email is valid
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(form.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
  
    // Check if password meets the minimum length
    if (form.password.length < 8) {
      Alert.alert('Error', 'Password should be at least 8 characters');
      return;
    }
  
    // Check if the user has accepted the terms
    if (!form.acceptedTerms) {
      Alert.alert('Error', 'You must accept the terms and conditions');
      return;
    }
  
    // Prepare data for submission
    const userData = {
      name: form.name,
      email: form.email,
      password: form.password,
      acceptedTerms: form.acceptedTerms,  // Ensure acceptedTerms is being sent
    };
  
    // Log the data being sent to the server
    console.log('Submitting user data:', userData);
  
    setIsLoading(true);
  
    try {
      const response = await fetch('http://10.0.2.2:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      console.log('Server response:', data);  // Log the server response
      
      if (!response.ok) {
        // Handle errors with more detail
        Alert.alert('Error', data.error || 'Something went wrong. Please try again.');
      } else {
        console.log('Signup successful:', data);
        navigation.replace('Welcome'); // Navigate to Welcome screen after successful signup
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if the form is valid for submission
  const isFormValid =
    form.acceptedTerms &&
    form.name.length > 0 &&
    form.email.length > 0 &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword;

  // Define input styles with proper TextStyle
  const inputStyles: TextStyle = {
    marginBottom: 15,
    backgroundColor: 'white',
    borderColor: '#89C6A7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
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
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
            autoCapitalize="words"
            inputStyle={inputStyles}
          />

          <InputField
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            inputStyle={inputStyles}
          />

          <InputField
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry
            inputStyle={inputStyles}
          />

          <InputField
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry
            inputStyle={inputStyles}
          />

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => handleChange('acceptedTerms', !form.acceptedTerms)}
            >
              {form.acceptedTerms && <View style={styles.checkboxChecked} />}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              I accept the terms and conditions
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            <Text style={styles.buttonText}>{isLoading ? 'Signing Up...' : 'SIGN UP'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInLink}
            onPress={() => navigation.navigate('SignIn')} // Navigate to SignInScreen if user already has an account
          >
            <Text style={styles.signInText}>Already have an account? Sign In</Text>
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00819E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: '#00819E',
  },
  termsText: {
    color: '#25596E',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#00819E',
    paddingVertical: 15,
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
  signInLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signInText: {
    color: '#25596E',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
