// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Alert, 
//   ImageBackground, 
//   TouchableOpacity,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform
// } from 'react-native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../navigation/types';
// import InputField from '../components/InputField';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import config from '../Config';

// type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

// const SignUpScreen: React.FC<{ navigation: SignUpScreenNavigationProp }> = ({ navigation }) => {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     acceptedTerms: false,
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [apiBaseUrl, setApiBaseUrl] = useState('');
//   const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

//   useEffect(() => {
//     const initializeConnection = async () => {
//       try {
//         const url = await config.getApiBaseUrl();
//         setApiBaseUrl(url);
//         setConnectionStatus('connected');
//       } catch (error) {
//         setConnectionStatus('failed');
//         console.error('Connection initialization failed:', error);
//       }
//     };
//     initializeConnection();
//   }, []);

//   const handleChange = (name: keyof typeof form, value: string | boolean) => {
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const validateForm = () => {
//     if (!form.name.trim()) return { valid: false, message: 'Please enter your name', code: 'missing_name' };
//     if (!isValidEmail(form.email)) return { valid: false, message: 'Please enter a valid email address', code: 'invalid_email' };
//     if (form.password.length < 8) return { valid: false, message: 'Password must be at least 8 characters', code: 'weak_password' };
//     if (form.password !== form.confirmPassword) return { valid: false, message: 'Passwords do not match', code: 'password_mismatch' };
//     if (!form.acceptedTerms) return { valid: false, message: 'You must accept the terms', code: 'terms_not_accepted' };
//     return { valid: true };
//   };

//   const handleSubmit = async () => {
//     const { valid, message, code } = validateForm();
//     if (!valid) {
//       Alert.alert('Validation Error', message);
//       return;
//     }

//     if (connectionStatus !== 'connected') {
//       Alert.alert('Connection Error', 
//         connectionStatus === 'failed' 
//           ? 'Cannot connect to server. Please check your network.' 
//           : 'Establishing connection...');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const registrationData = {
//         name: form.name.trim(),
//         email: form.email.toLowerCase().trim(),
//         password: form.password,
//         terms_accepted: form.acceptedTerms
//       };

//       console.log('Registration payload:', registrationData);

//       const response = await axios.post(`${apiBaseUrl}/auth/register`, 
//         registrationData,
//         {
//           timeout: config.timeout,
//           headers: { 
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//           }
//         }
//       );

//       console.log('Registration response:', {
//         status: response.status,
//         data: {
//           ...response.data,
//           token: response.data.token ? '***REDACTED***' : null
//         }
//       });

//       if (!response.data.token || !response.data.user) {
//         throw new Error('Server response missing token or user data');
//       }

//       // Store auth data securely
//       await AsyncStorage.multiSet([
//         ['userToken', response.data.token],
//         ['userData', JSON.stringify(response.data.user)]
//       ]);

//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Welcome' }],
//       });

//     } catch (error) {
//       console.error('Registration error:', error);
      
//       let errorMessage = 'Registration failed. Please try again.';
//       let errorCode = 'registration_failed';
      
//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           errorMessage = error.response.data?.error || error.response.data?.message || `Server error (${error.response.status})`;
//           errorCode = error.response.data?.code || 'server_error';
//         } else if (error.request) {
//           errorMessage = 'No response from server. Check your connection.';
//           errorCode = 'no_response';
//         }
//       }

//       Alert.alert('Registration Error', errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isFormValid = form.name.trim() &&
//                     isValidEmail(form.email) &&
//                     form.password.length >= 8 &&
//                     form.password === form.confirmPassword &&
//                     form.acceptedTerms;

//   return (
//     <ImageBackground 
//       source={require('../assets/background.png')} 
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.container}
//       >
//         <View style={styles.card}>
//           <Text style={styles.title}>Create Account</Text>

//           <InputField
//             placeholder="Full Name"
//             value={form.name}
//             onChangeText={(text) => handleChange('name', text)}
//             autoCapitalize="words"
//           />

//           <InputField
//             placeholder="Email"
//             value={form.email}
//             onChangeText={(text) => handleChange('email', text)}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />

//           <InputField
//             placeholder="Password (min 8 characters)"
//             value={form.password}
//             onChangeText={(text) => handleChange('password', text)}
//             secureTextEntry
//           />

//           <InputField
//             placeholder="Confirm Password"
//             value={form.confirmPassword}
//             onChangeText={(text) => handleChange('confirmPassword', text)}
//             secureTextEntry
//           />

//           <View style={styles.termsContainer}>
//             <TouchableOpacity
//               style={[styles.checkbox, form.acceptedTerms && styles.checkboxActive]}
//               onPress={() => handleChange('acceptedTerms', !form.acceptedTerms)}
//             >
//               {form.acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
//             </TouchableOpacity>
//             <Text style={styles.termsText}>I accept the terms and conditions</Text>
//           </View>

//           <TouchableOpacity
//             style={[styles.button, (!isFormValid || isLoading) && styles.buttonDisabled]}
//             onPress={handleSubmit}
//             disabled={!isFormValid || isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>SIGN UP</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.loginLink}
//             onPress={() => navigation.navigate('SignIn')}
//           >
//             <Text style={styles.loginText}>
//               Already have an account? <Text style={styles.loginHighlight}>Log In</Text>
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   card: {
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     borderRadius: 16,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#25596E',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   termsContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 16,
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 6,
//     borderWidth: 2,
//     borderColor: '#00819E',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   checkboxActive: {
//     backgroundColor: '#00819E',
//   },
//   checkmark: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   termsText: {
//     color: '#25596E',
//     fontSize: 14,
//     flex: 1,
//   },
//   button: {
//     backgroundColor: '#00819E',
//     padding: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 16,
//     shadowColor: '#00819E',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   loginLink: {
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   loginText: {
//     color: '#25596E',
//     fontSize: 14,
//   },
//   loginHighlight: {
//     fontWeight: 'bold',
//     textDecorationLine: 'underline',
//   },
// });

// export default SignUpScreen;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  ImageBackground, 
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import InputField from '../components/InputField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../Config';
import { useLanguage } from '../contexts/LanguageContext';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<{ navigation: SignUpScreenNavigationProp }> = ({ navigation }) => {
  const { t, isRTL } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const url = await config.getApiBaseUrl();
        setApiBaseUrl(url);
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('failed');
        console.error(t('connection_error'), error);
      }
    };
    initializeConnection();
  }, []);

  const handleChange = (name: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    if (!form.name.trim()) return { valid: false, message: t('name_required'), code: 'missing_name' };
    if (!isValidEmail(form.email)) return { valid: false, message: t('invalid_email'), code: 'invalid_email' };
    if (form.password.length < 8) return { valid: false, message: t('password_length'), code: 'weak_password' };
    if (form.password !== form.confirmPassword) return { valid: false, message: t('password_mismatch'), code: 'password_mismatch' };
    if (!form.acceptedTerms) return { valid: false, message: t('accept_terms'), code: 'terms_not_accepted' };
    return { valid: true };
  };

  const handleSubmit = async () => {
    const { valid, message, code } = validateForm();
    if (!valid) {
      Alert.alert(t('validation_error'), message);
      return;
    }

    if (connectionStatus !== 'connected') {
      Alert.alert(t('connection_error'), 
        connectionStatus === 'failed' 
          ? t('connection_failed') 
          : t('establishing_connection'));
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        name: form.name.trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        terms_accepted: form.acceptedTerms
      };

      const response = await axios.post(`${apiBaseUrl}/auth/register`, 
        registrationData,
        {
          timeout: config.timeout,
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.data.token || !response.data.user) {
        throw new Error(t('missing_token_error'));
      }

      await AsyncStorage.multiSet([
        ['userToken', response.data.token],
        ['userData', JSON.stringify(response.data.user)]
      ]);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });

    } catch (error) {
      console.error(t('registration_error'), error);
      
      let errorMessage = t('registration_failed');
      let errorCode = 'registration_failed';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.error || error.response.data?.message || `${t('server_error')} (${error.response.status})`;
          errorCode = error.response.data?.code || 'server_error';
        } else if (error.request) {
          errorMessage = t('no_server_response');
          errorCode = 'no_response';
        }
      }

      Alert.alert(t('registration_error'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = form.name.trim() &&
                    isValidEmail(form.email) &&
                    form.password.length >= 8 &&
                    form.password === form.confirmPassword &&
                    form.acceptedTerms;

  // RTL-aware styles
  const rtlStyles = StyleSheet.create({
    container: {
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    title: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    termsContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    checkbox: {
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    loginText: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    }
  });

  return (
    <ImageBackground 
      source={require('../assets/background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>

          <InputField
            placeholder="Full Name"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
            autoCapitalize="words"
          />

          <InputField
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry
          />

          <InputField
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry
          />

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={[styles.checkbox, form.acceptedTerms && styles.checkboxActive]}
              onPress={() => handleChange('acceptedTerms', !form.acceptedTerms)}
            >
              {form.acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.termsText}>I accept the terms and conditions</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, (!isFormValid || isLoading) && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginHighlight}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#25596E',
    textAlign: 'center',
    marginBottom: 24,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#00819E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: '#00819E',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    color: '#25596E',
    fontSize: 14,
    flex: 1,
  },
  button: {
    backgroundColor: '#00819E',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#00819E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    color: '#25596E',
    fontSize: 14,
  },
  loginHighlight: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;