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
  ScrollView
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

  // RTL-aware dynamic styles
  const dynamicStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    card: {
      alignItems: 'stretch',
    },
    title: {
      textAlign: 'center',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    termsContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
    },
    checkbox: {
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    termsText: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    loginText: {
      textAlign: 'center',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    inputContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
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
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, dynamicStyles.card]}>
            <Text style={[styles.title, dynamicStyles.title]}>{t('create_account')}</Text>

            <InputField
              placeholder={t('full_name')}
              value={form.name}
              onChangeText={(text) => handleChange('name', text)}
              autoCapitalize="words"
              textAlign={isRTL ? 'right' : 'left'}
              writingDirection={isRTL ? 'rtl' : 'ltr'}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputField}
            />

            <InputField
              placeholder={t('email')}
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign={isRTL ? 'right' : 'left'}
              writingDirection={isRTL ? 'rtl' : 'ltr'}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputField}
            />

            <InputField
              placeholder={t('password')}
              value={form.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
              textAlign={isRTL ? 'right' : 'left'}
              writingDirection={isRTL ? 'rtl' : 'ltr'}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputField}
            />

            <InputField
              placeholder={t('confirm_password')}
              value={form.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              secureTextEntry
              textAlign={isRTL ? 'right' : 'left'}
              writingDirection={isRTL ? 'rtl' : 'ltr'}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputField}
            />

            <View style={[styles.termsContainer, dynamicStyles.termsContainer]}>
              <TouchableOpacity
                style={[styles.checkbox, dynamicStyles.checkbox, form.acceptedTerms && styles.checkboxActive]}
                onPress={() => handleChange('acceptedTerms', !form.acceptedTerms)}
              >
                {form.acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={[styles.termsText, dynamicStyles.termsText]}>
                {t('accept_terms')}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, (!isFormValid || isLoading) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t('sign_up')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={[styles.loginText, dynamicStyles.loginText]}>
                {t('have_account')} <Text style={styles.loginHighlight}>{t('log_in')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#25596E',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputField: {
    width: '100%',
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    borderWidth: 0, // No border
    borderBottomWidth: 0, // No underline
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00819E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: '#00819E',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    color: '#25596E',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#00819E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
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