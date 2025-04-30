// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../navigation/types';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import config from '../Config';

// type SetLanguageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SetLanguage'>;

// const languages = [
//   { key: 'french', label: 'French Language', value: 'French' },
//   { key: 'arabic', label: 'Arabic Language', value: 'Arabic' },
//   { key: 'english', label: 'English Language', value: 'English' },
// ];

// const SetLanguageScreen = () => {
//   const navigation = useNavigation<SetLanguageScreenNavigationProp>();
//   const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
//   const [apiBaseUrl, setApiBaseUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const initialize = async () => {
//       const url = await config.getApiBaseUrl();
//       setApiBaseUrl(url);
//     };
//     initialize();
//   }, []);

//   const handleLanguageSelection = async () => {
//     if (!selectedLanguage) return;
    
//     setIsLoading(true);
//     try {
//       // 1. Get current user data
//       const userToken = await AsyncStorage.getItem('userToken');
//       if (!userToken) {
//         throw new Error('User not authenticated');
//       }

//       // 2. Update language in backend database
//       const response = await axios.put(
//         `${apiBaseUrl}/auth/update-profile`,
//         { language: selectedLanguage },
//         {
//           headers: {
//             'Authorization': `Bearer ${userToken}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       // 3. Update local storage
//       const userData = JSON.parse(await AsyncStorage.getItem('userData') || '{}');
//       const updatedUser = {
//         ...userData,
//         language: selectedLanguage
//       };
      
//       await AsyncStorage.multiSet([
//         ['userData', JSON.stringify(updatedUser)],
//         ['userLanguage', selectedLanguage],
//         ['onboardingComplete', 'true']
//       ]);

//       // 4. Navigate to Home
//       navigation.reset({
//         index: 0,
//         routes: [{ name: 'Home' }]
//       });
      
//     } catch (error) {
//       console.error('Language update error:', error);
//       Alert.alert('Error', 'Failed to save language preference');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top Icon */}
//       <View style={styles.circleIconContainer}>
//         <Image
//           source={require('../assets/Hand_signs-removebg-preview.png')}
//           style={styles.circleImage}
//         />
//       </View>

//       {/* Main Card */}
//       <View style={styles.card}>
//         <Text style={styles.title}>Choose Language</Text>

//         {/* Language Options */}
//         {languages.map((lang) => (
//           <TouchableOpacity
//             key={lang.key}
//             style={[
//               styles.languageOption,
//               selectedLanguage === lang.value && styles.languageOptionSelected, // Changed from lang.key to lang.value
//             ]}
//             onPress={() => setSelectedLanguage(lang.value)} // Changed from lang.key to lang.value
//           >
//             <Text style={styles.languageText}>{lang.label}</Text>
//             <View style={styles.circle}>
//               {selectedLanguage === lang.value && <Text style={styles.tick}>✔</Text>} {/* Changed from lang.key to lang.value */}
//             </View>
//           </TouchableOpacity>
//         ))}

//         {/* Continue Button */}
//         {selectedLanguage && (
//           <TouchableOpacity 
//             style={styles.continueButton} 
//             onPress={handleLanguageSelection} // Changed from handleContinue to handleLanguageSelection
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="white" />
//             ) : (
//               <Text style={styles.continueText}>Continue</Text>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Bottom Image */}
//       <Image source={require('../assets/two.jpg')} style={styles.bottomImage} />
//     </View>
//   );
// };



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   circleIconContainer: {
//     backgroundColor: '#7FBF9D',
//     borderRadius: 50,
//     width: 80,
//     height: 80,
//     marginTop: 20,
//     marginLeft: -250,
//     top: 30,
//     left: 20,
//   },
//   circleImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   card: {
//     backgroundColor: '#2D5C74',
//     padding: 20,
//     borderRadius: 30,
//     width: '80%',
//     height: '60%',
//     justifyContent: 'center',
//     marginTop: 40,
//   },
//   title: {
//     color: 'white',
//     fontSize: 30,
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   languageOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#3B7D97',
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 12,
//   },
//   languageOptionSelected: {
//     backgroundColor: '#569EB3',
//   },
//   languageText: {
//     color: 'white',
//     fontSize: 20,
//   },
//   circle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#FFFFFF',
//     marginRight: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tick: {
//     fontSize: 20,
//     color: '#2D5C74',
//   },
//   continueButton: {
//     marginTop: 30,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     backgroundColor: '#7FBF9D',
//   },
//   continueText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   bottomImage: {
//     width: '110%',
//     height: 200,
//     resizeMode: 'contain',
//   },
// });

// export default SetLanguageScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../Config';
import { useLanguage } from '../contexts/LanguageContext';

type SetLanguageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SetLanguage'>;

const SetLanguageScreen = () => {
  const navigation = useNavigation<SetLanguageScreenNavigationProp>();
  const { t, setLocale, isRTL } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Language options with both display values and internal codes
  const languages = [
    { 
      key: 'french', 
      display: t('french_language'), 
      value: 'French', 
      code: 'fr',
      icon: '🇫🇷'
    },
    { 
      key: 'arabic', 
      display: t('arabic_language'), 
      value: 'Arabic', 
      code: 'ar',
      icon: '🇸🇦'
    },
    { 
      key: 'english', 
      display: t('english_language'), 
      value: 'English', 
      code: 'en',
      icon: '🇬🇧'
    },
  ];

  // Load user's preferred language if already set
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        }
      } catch (error) {
        console.log('Error loading language preference:', error);
      }
    };

    const initializeApi = async () => {
      const url = await config.getApiBaseUrl();
      setApiBaseUrl(url);
    };

    loadLanguagePreference();
    initializeApi();
  }, []);

  const handleLanguageSelection = async () => {
    if (!selectedLanguage) {
      Alert.alert(t('error'), t('select_language_warning'));
      return;
    }
    
    setIsLoading(true);
    try {
      // Find the complete language object
      const selectedLang = languages.find(lang => lang.value === selectedLanguage);
      if (!selectedLang) {
        throw new Error('Invalid language selection');
      }

      // 1. Update app language context immediately
      setLocale(selectedLang.code);
      
      // 2. Update backend if user is authenticated
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        await axios.put(
          `${apiBaseUrl}/auth/update-profile`,
          { language: selectedLanguage },
          {
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // 3. Update local storage
      await AsyncStorage.multiSet([
        ['userLanguage', selectedLanguage],
        ['onboardingComplete', 'true']
      ]);

      // 4. Force RTL layout if Arabic is selected
      if (selectedLang.code === 'ar' && !I18nManager.isRTL) {
        I18nManager.forceRTL(true);
      } else if (selectedLang.code !== 'ar' && I18nManager.isRTL) {
        I18nManager.forceRTL(false);
      }

      // 5. Navigate to Home with reset to prevent going back
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
      
    } catch (error) {
      console.error('Language update error:', error);
      Alert.alert(t('error'), t('save_language_error'));
    } finally {
      setIsLoading(false);
    }
  };

  // RTL-aware styles
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    circleIconContainer: {
      marginLeft: isRTL ? 20 : -250,
      alignSelf: isRTL ? 'flex-start' : undefined,
    },
    card: {
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    title: {
      textAlign: isRTL ? 'right' : 'center',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    languageOption: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    languageContent: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
    },
    circle: {
      marginRight: isRTL ? 0 : 15,
      marginLeft: isRTL ? 15 : 0,
    },
    languageText: {
      textAlign: isRTL ? 'right' : 'left',
      marginHorizontal: 10,
    }
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Top Icon */}
      <View style={[styles.circleIconContainer, dynamicStyles.circleIconContainer]}>
        <Image
          source={require('../assets/Hand_signs-removebg-preview.png')}
          style={styles.circleImage}
        />
      </View>

      {/* Main Card */}
      <View style={[styles.card, dynamicStyles.card]}>
        <Text style={[styles.title, dynamicStyles.title]}>{t('choose_language')}</Text>

        {/* Language Options */}
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.key}
            style={[
              styles.languageOption,
              dynamicStyles.languageOption,
              selectedLanguage === lang.value && styles.languageOptionSelected,
            ]}
            onPress={() => setSelectedLanguage(lang.value)}
          >
            <View style={dynamicStyles.languageContent}>
              <Text style={{ fontSize: 24 }}>{lang.icon}</Text>
              <Text style={[styles.languageText, dynamicStyles.languageText]}>
                {lang.display}
              </Text>
            </View>
            <View style={[styles.circle, dynamicStyles.circle]}>
              {selectedLanguage === lang.value && <Text style={styles.tick}>✔</Text>}
            </View>
          </TouchableOpacity>
        ))}

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton, 
            !selectedLanguage && styles.disabledButton
          ]} 
          onPress={handleLanguageSelection}
          disabled={!selectedLanguage || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueText}>{t('continue')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Image */}
      <Image source={require('../assets/two.jpg')} style={styles.bottomImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  circleIconContainer: {
    backgroundColor: '#7FBF9D',
    borderRadius: 50,
    width: 80,
    height: 80,
    marginTop: 20,
    top: 30,
  },
  circleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  card: {
    backgroundColor: '#2D5C74',
    padding: 20,
    borderRadius: 30,
    width: '80%',
    height: '60%',
    justifyContent: 'center',
    marginTop: 40,
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginBottom: 30,
  },
  languageOption: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3B7D97',
    padding: 15,
    borderRadius: 10,
    marginVertical: 12,
  },
  languageOptionSelected: {
    backgroundColor: '#569EB3',
  },
  languageText: {
    color: 'white',
    fontSize: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: {
    fontSize: 20,
    color: '#2D5C74',
  },
  continueButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#7FBF9D',
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomImage: {
    width: '110%',
    height: 200,
    resizeMode: 'contain',
  },
});

export default SetLanguageScreen;