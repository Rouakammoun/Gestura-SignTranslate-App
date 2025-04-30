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
//   Platform,
//   ToastAndroid
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { RootStackParamList } from '../navigation/types';
// import InputField from '../components/InputField';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import config from '../Config';
// import axios from 'axios';
// import { StackNavigationProp } from '@react-navigation/stack';

// type SignInScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'SignIn'
// >;

// const SignInScreen = () => {
//   const navigation = useNavigation<SignInScreenNavigationProp>();
//   const [credentials, setCredentials] = useState({
//     email: '',
//     password: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiBaseUrl, setApiBaseUrl] = useState('');
//   const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

//   useEffect(() => {
//     const initializeConnection = async () => {
//       let url = '';
//       setConnectionStatus('checking');
//       try {
//         url = await config.getApiBaseUrl();
//         setApiBaseUrl(url);
//         const pingUrl = `${url}/auth/ping`;
//         console.log(`[${Platform.OS}] Attempting to ping server at: ${pingUrl}`);

//         await axios.get(pingUrl, { timeout: 5000 });
//         setConnectionStatus('connected');
//         console.log(`[${Platform.OS}] Backend connection successful via ${pingUrl}`);
//       } catch (error) {
//         setConnectionStatus('failed');
//         const checkUrl = url ? `${url}/auth/ping` : 'the configured URL';
//         if (axios.isAxiosError(error)) {
//           console.error(`[${Platform.OS}] Connection initialization failed to ${checkUrl}: ${error.message}`, error.code ? `(Code: ${error.code})` : '');
//         } else {
//           console.error(`[${Platform.OS}] Connection initialization failed to ${checkUrl}:`, error);
//         }
//       }
//     };
//     initializeConnection();
//   }, []);

//   const handleChange = (field: keyof typeof credentials, value: string) => {
//     setCredentials(prev => ({ ...prev, [field]: value }));
//   };

//   const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSignIn = async () => {
//     if (!credentials.email || !credentials.password) {
//       Alert.alert('Error', 'Please fill in all fields');
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
//       const normalizedEmail = credentials.email.toLowerCase().trim();
//       console.log('Signin attempt with:', { email: normalizedEmail, password: '[HIDDEN]' });

//       const response = await axios.post(`${apiBaseUrl}/auth/signin`, {
//         email: normalizedEmail,
//         password: credentials.password
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         validateStatus: (status) => status < 500
//       });

//       console.log('Signin response:', {
//         status: response.status,
//         data: {
//           ...response.data,
//           token: response.data.token ? '***REDACTED***' : null
//         }
//       });

//       if (response.status === 200) {
//         if (!response.data.token || !response.data.user) {
//           throw new Error('Server response missing token or user data');
//         }

//         // Store complete user data from server response
//         await AsyncStorage.multiSet([
//           ['userToken', response.data.token],
//           ['userData', JSON.stringify({
//             id: response.data.user.id,
//             name: response.data.user.name,
//             email: response.data.user.email,
//             phoneNumber: response.data.user.phoneNumber || null,
//             language: response.data.user.language || null,
//             profileImage: response.data.user.profileImage || null
//           })]
//         ]);

//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'Home' }]
//         });
        
//         ToastAndroid.show('Sign-in successful!', ToastAndroid.SHORT);
//       } else {
//         throw new Error(response.data.error || 'Sign-in failed');
//       }
//     } catch (error) {
//       console.error('SignIn error:', error);
      
//       let errorMessage = 'Sign-in failed. Please try again.';
//       let errorDetails = '';
      
//       if (axios.isAxiosError(error)) {
//         if (error.response) {
//           errorMessage = error.response.data?.error || `Error: ${error.response.status}`;
//           errorDetails = error.response.data?.message || '';
//         } else if (error.request) {
//           errorMessage = 'No response from server. Check your connection.';
//         }
//       } else if (error instanceof Error) {
//         errorDetails = error.message;
//       }

//       Alert.alert('SignIn Error', `${errorMessage}${errorDetails ? `\n\n${errorDetails}` : ''}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isFormValid = credentials.email && credentials.password;

//   return (
//     <ImageBackground
//       source={require('../assets/background.png')}
//       style={styles.background}
//       resizeMode="cover"
//     >
//       <View style={styles.container}>
//         <View style={styles.card}>
//           <Text style={styles.title}>Gestura</Text>

//           <InputField
//             placeholder="Email"
//             value={credentials.email}
//             onChangeText={(text) => handleChange('email', text)}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />

//           <InputField
//             placeholder="Password"
//             value={credentials.password}
//             onChangeText={(text) => handleChange('password', text)}
//             secureTextEntry
//           />

//           <TouchableOpacity
//             style={[styles.button, (!isFormValid || isLoading) && styles.buttonDisabled]}
//             onPress={handleSignIn}
//             disabled={!isFormValid || isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>SIGN IN</Text>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.signUpLink}
//             onPress={() => navigation.navigate('SignUp')}
//           >
//             <Text style={styles.signUpText}>
//               Don't have an account? <Text style={styles.signUpHighlight}>Sign Up</Text>
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   card: {
//     width: '100%',
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#25596E',
//     textAlign: 'center',
//     marginBottom: 24,
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
//     backgroundColor: '#cccccc',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   signUpLink: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   signUpText: {
//     color: '#25596E',
//   },
//   signUpHighlight: {
//     color: '#25596E',
//     fontWeight: 'bold',
//   },
// });

// export default SignInScreen;

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
  Platform,
  ToastAndroid
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import InputField from '../components/InputField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../Config';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLanguage } from '../contexts/LanguageContext';

type SignInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const { t, isRTL } = useLanguage();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

  useEffect(() => {
    const initializeConnection = async () => {
      let url = '';
      setConnectionStatus('checking');
      try {
        url = await config.getApiBaseUrl();
        setApiBaseUrl(url);
        const pingUrl = `${url}/auth/ping`;
        console.log(`[${Platform.OS}] Attempting to ping server at: ${pingUrl}`);

        await axios.get(pingUrl, { timeout: 5000 });
        setConnectionStatus('connected');
        console.log(`[${Platform.OS}] Backend connection successful via ${pingUrl}`);
      } catch (error) {
        setConnectionStatus('failed');
        const checkUrl = url ? `${url}/auth/ping` : 'the configured URL';
        if (axios.isAxiosError(error)) {
          console.error(`[${Platform.OS}] Connection initialization failed to ${checkUrl}: ${error.message}`, error.code ? `(Code: ${error.code})` : '');
        } else {
          console.error(`[${Platform.OS}] Connection initialization failed to ${checkUrl}:`, error);
        }
      }
    };
    initializeConnection();
  }, []);

  const handleChange = (field: keyof typeof credentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignIn = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert(t('error'), t('fill_all_fields'));
      return;
    }

    if (!isValidEmail(credentials.email)) {
      Alert.alert(t('error'), t('invalid_email'));
      return;
    }

    if (connectionStatus !== 'connected') {
      Alert.alert(t('connection_error'), 
        connectionStatus === 'failed' 
          ? t('connection_failed_message')
          : t('establishing_connection'));
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = credentials.email.toLowerCase().trim();
      console.log('Signin attempt with:', { email: normalizedEmail, password: '[HIDDEN]' });

      const response = await axios.post(`${apiBaseUrl}/auth/signin`, {
        email: normalizedEmail,
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        validateStatus: (status) => status < 500
      });

      console.log('Signin response:', {
        status: response.status,
        data: {
          ...response.data,
          token: response.data.token ? '***REDACTED***' : null
        }
      });

      if (response.status === 200) {
        if (!response.data.token || !response.data.user) {
          throw new Error(t('missing_token_error'));
        }

        await AsyncStorage.multiSet([
          ['userToken', response.data.token],
          ['userData', JSON.stringify({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            phoneNumber: response.data.user.phoneNumber || null,
            language: response.data.user.language || null,
            profileImage: response.data.user.profileImage || null
          })]
        ]);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }]
        });
        
        ToastAndroid.show(t('signin_success'), ToastAndroid.SHORT);
      } else {
        throw new Error(response.data.error || t('signin_failed'));
      }
    } catch (error) {
      console.error('SignIn error:', error);
      
      let errorMessage = t('signin_error_default');
      let errorDetails = '';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.error || `${t('error')}: ${error.response.status}`;
          errorDetails = error.response.data?.message || '';
        } else if (error.request) {
          errorMessage = t('no_server_response');
        }
      } else if (error instanceof Error) {
        errorDetails = error.message;
      }

      Alert.alert(t('signin_error'), `${errorMessage}${errorDetails ? `\n\n${errorDetails}` : ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = credentials.email && credentials.password;

  // RTL-aware styles
  const rtlStyles = StyleSheet.create({
    container: {
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    title: {
      textAlign: 'center',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    signUpText: {
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
        style={{ flex: 1 }}
      >
        <View style={[styles.container, rtlStyles.container]}>
          <View style={styles.card}>
            <Text style={[styles.title, rtlStyles.title]}>{t('app_name')}</Text>

            <InputField
              placeholder={t('email')}
              value={credentials.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              placeholder={t('password')}
              value={credentials.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, (!isFormValid || isLoading) && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('sign_in').toUpperCase()}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={[styles.signUpText, rtlStyles.signUpText]}>
                {t('no_account')} <Text style={styles.signUpHighlight}>{t('sign_up')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#25596E',
    marginBottom: 24,
    
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
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signUpLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  signUpText: {
    color: '#25596E',
  },
  signUpHighlight: {
    color: '#25596E',
    fontWeight: 'bold',
  },
});

export default SignInScreen;