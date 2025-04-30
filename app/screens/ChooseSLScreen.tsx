// import React from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../navigation/types';

// // Define types for navigation
// type Props = NativeStackScreenProps<RootStackParamList, 'ChooseLanguage'>;

// const ChooseLanguageScreen = () => {
//   const navigation = useNavigation<Props['navigation']>();

//   // Navigate to HomeScreen
//   const goToHome = () => {
//     navigation.navigate('Home');
//   };

//   // Navigate to SignToTextScreen without passing any parameters
//   const goToSignToText = () => {
//     navigation.navigate('SignToText');
//   };

//   return (
//     <LinearGradient
//       colors={['#88C5A6', '#88C5A6']}
//       style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
//     >
//       {/* Close button */}
//       <TouchableOpacity onPress={goToHome} style={{ position: 'absolute', top: 40, left: 20 }}>
//         <Ionicons name='close-circle' size={40} color='#003C47' />
//       </TouchableOpacity>

//       {/* Title */}
//       <View style={{ marginBottom: 50 }}>
//         <Text
//           style={{
//             fontSize: 24,
//             color: '#003C47',
//             backgroundColor: '#FFFF',
//             paddingVertical: 10,
//             paddingHorizontal: 50,
//             borderRadius: 20,
//           }}
//         >
//           Choose Sign Language
//         </Text>
//       </View>

//       {/* Language buttons */}
//       <TouchableOpacity onPress={goToSignToText} style={{ marginVertical: 10, width: '60%' }}>
//         <LinearGradient colors={['#396F7A', '#396F7A']} style={{ paddingVertical: 15, borderRadius: 30, alignItems: 'center' }}>
//           <Text style={{ color: '#FFFFFF', fontSize: 20 }}>TunSL</Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={goToSignToText} style={{ marginVertical: 10, width: '60%' }}>
//         <LinearGradient colors={['#396F7A', '#396F7A']} style={{ paddingVertical: 15, borderRadius: 30, alignItems: 'center' }}>
//           <Text style={{ color: '#FFFFFF', fontSize: 20 }}>ArSL</Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={goToSignToText} style={{ marginVertical: 10, width: '60%' }}>
//         <LinearGradient colors={['#396F7A', '#396F7A']} style={{ paddingVertical: 15, borderRadius: 30, alignItems: 'center' }}>
//           <Text style={{ color: '#FFFFFF', fontSize: 20 }}>ASL</Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// };
// export default ChooseLanguageScreen;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useLanguage } from '../contexts/LanguageContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseLanguage'>;

// Define your translation keys type
type TranslationKeys = 
  | 'choose_sign_language'
  | 'american_sign_language'
  | 'tunisian_sign_language'
  | 'arabic_sign_language'
  | 'settings'
  | 'welcome'
  | 'sign_in'
  | 'sign_up'
  | 'choose_language'
  | 'english'
  | 'french'
  | 'arabic';

interface LanguageOption {
  code: string;
  name: string;
  label: TranslationKeys;
}

const ChooseLanguageScreen = () => {
  const navigation = useNavigation<Props['navigation']>();
  const { t, setLocale, isRTL } = useLanguage();

  // Type-safe sign language options
  const languages: LanguageOption[] = [
    { code: 'asl', name: 'ASL', label: 'american_sign_language' },
    { code: 'tsl', name: 'TSL', label: 'tunisian_sign_language' },
    { code: 'arsl', name: 'ArSL', label: 'arabic_sign_language' }
  ];

  const goToHome = () => {
    navigation.navigate('Home');
  };

  const handleLanguageSelect = (languageCode: string) => {
    setLocale(languageCode);
    navigation.navigate('SignToText');
  };

  return (
    <LinearGradient
      colors={['#88C5A6', '#88C5A6']}
      style={[styles.container, isRTL && styles.rtlContainer]}
    >
      <TouchableOpacity 
        onPress={goToHome} 
        style={[styles.closeButton, isRTL ? styles.closeButtonRTL : styles.closeButtonLTR]}
      >
        <Ionicons name='close-circle' size={40} color='#003C47' />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          {t('choose_sign_language')}
        </Text>
      </View>

      {languages.map((language) => (
        <TouchableOpacity 
          key={language.code}
          onPress={() => handleLanguageSelect(language.code)} 
          style={styles.languageButton}
        >
          <LinearGradient 
            colors={['#396F7A', '#396F7A']} 
            style={styles.languageButtonGradient}
          >
            <Text style={styles.languageButtonText}>
              {language.name} - {t(language.label)}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rtlContainer: {
    direction: 'rtl',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
  },
  closeButtonLTR: {
    left: 20,
  },
  closeButtonRTL: {
    right: 20,
  },
  titleContainer: {
    marginBottom: 50,
  },
  titleText: {
    fontSize: 24,
    color: '#003C47',
    backgroundColor: '#FFFF',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 20,
    textAlign: 'center',
  },
  languageButton: {
    marginVertical: 10,
    width: '80%',
  },
  languageButtonGradient: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default ChooseLanguageScreen;
