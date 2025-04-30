// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity } from 'react-native';
// import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import NavBar from '../components/NavBar';
// import { SafeAreaView } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
// import { RootStackParamList } from '../navigation/types'; // Ensure this is defined
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// // Define the type for navigation props
// type TextOrSpeechToSignScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TextOrSpeechToSign'>;

// const TextOrSpeechToSignScreen = () => {
//     const [inputText, setInputText] = useState('');
//     const [selectedLanguage, setSelectedLanguage] = useState('en');

//     // Navigation hook with the correct type
//     const navigation = useNavigation<TextOrSpeechToSignScreenNavigationProp>();

//     // Toggle between Arabic, French, and English
//     const toggleLanguage = () => {
//         const languages = ['en', 'fr', 'ar'];
//         const nextIndex = (languages.indexOf(selectedLanguage) + 1) % languages.length;
//         setSelectedLanguage(languages[nextIndex]);
//     };

//     const handleTranslate = () => {
//         alert('Translating sign language to avatar: ' + inputText);
//     };

//     const handleSpeechToSign = () => {
//         alert('Speech to Sign activated');
//     };

//     // Function to handle close button navigation
//     const handleClose = () => {
//         navigation.navigate('Home'); // Navigate to the Home screen
//     };

//     return (
//         <LinearGradient colors={['#88C5A6', '#396F7A']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             {/* Safe Area to Avoid Status Bar Overlap */}
//             <SafeAreaView style={{ width: '100%', alignItems: 'flex-start', paddingTop: 3, paddingLeft: 10 }}>
//                 <TouchableOpacity onPress={handleClose}>
//                     <Ionicons name='close-circle' size={40} color='#003C47' />
//                 </TouchableOpacity>
//             </SafeAreaView>

//             {/* Title */}
//             <View style={{ marginBottom: 20 }}>
//                 <Text style={{ fontSize: 24, color: '#003C47', backgroundColor: '#B2E8D7', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 }}>
//                     Text/Speech to Sign
//                 </Text>
//             </View>

//             {/* Animated Avatar Placeholder */}
//             <View style={{
//                 width: '80%',
//                 height: '50%',
//                 backgroundColor: '#FFFFFF',
//                 borderRadius: 30,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginBottom: 20,
//                 borderWidth: 4,
//                 borderColor: '#A2E9C5'
//             }}>
//                 <Text style={{ fontSize: 18, color: '#000' }}>Animated Avatar Placeholder</Text>
//             </View>

//             {/* Text Input with Language and Microphone Icons */}
//             <View style={{
//                 flexDirection: 'row',
//                 width: '80%',
//                 height: '8%',
//                 backgroundColor: '#FFFFFF',
//                 borderRadius: 20,
//                 paddingHorizontal: 15,
//                 alignItems: 'center',
//                 borderWidth: 3,
//                 borderColor: '#A2E9C5',
//                 marginBottom: 20
//             }}>
//                 <TextInput
//                     style={{ flex: 1, fontSize: 18, color: '#000' }}
//                     placeholder='Insert Text'
//                     placeholderTextColor='#888'
//                     value={inputText}
//                     onChangeText={setInputText}
//                 />
//                 {/* Language Button */}
//                 <TouchableOpacity onPress={toggleLanguage} style={{ marginHorizontal: 10 }}>
//                     <FontAwesome5 name='language' size={28} color='#003C47' />
//                     <Text style={{ fontSize: 12, color: '#003C47', textAlign: 'center' }}>
//                         {selectedLanguage.toUpperCase()}
//                     </Text>
//                 </TouchableOpacity>
//                 {/* Microphone Button */}
//                 <TouchableOpacity onPress={handleSpeechToSign} style={{ marginHorizontal: 10 }}>
//                     <Ionicons name='mic' size={28} color='#003C47' />
//                 </TouchableOpacity>
//             </View>

//             {/* Translate Button */}
//             <TouchableOpacity
//                 onPress={handleTranslate}
//                 style={{
//                     backgroundColor: '#003C47',
//                     paddingVertical: 12,
//                     paddingHorizontal: 40,
//                     borderRadius: 20,
//                     marginBottom: 20,
//                     elevation: 4,
//                     shadowColor: '#000',
//                     shadowOffset: { width: 0, height: 2 },
//                     shadowOpacity: 0.4,
//                     shadowRadius: 5,
//                 }}
//             >
//                 <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }}>Translate to Avatar</Text>
//             </TouchableOpacity>

//             {/* Navigation Bar */}
//             <NavBar />
//         </LinearGradient>
//     );
// };

// export default TextOrSpeechToSignScreen;

// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet,
//   SafeAreaView,
//   Alert
// } from 'react-native';
// import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import NavBar from '../components/NavBar';
// import { useNavigation } from '@react-navigation/native';
// import { RootStackParamList } from '../navigation/types';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { useLanguage } from '../contexts/LanguageContext';

// type TextOrSpeechToSignScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TextOrSpeechToSign'>;

// const TextOrSpeechToSignScreen = () => {
//     const { t, isRTL, setLocale } = useLanguage();
//     const [inputText, setInputText] = useState('');
//     const [currentLanguage, setCurrentLanguage] = useState('en');
//     const navigation = useNavigation<TextOrSpeechToSignScreenNavigationProp>();

//     // Toggle between Arabic, French, and English
//     const toggleLanguage = () => {
//         const languages = ['en', 'fr', 'ar'];
//         const currentIndex = languages.indexOf(currentLanguage);
//         const nextIndex = (currentIndex + 1) % languages.length;
//         const nextLanguage = languages[nextIndex];
//         setCurrentLanguage(nextLanguage);
//         setLocale(nextLanguage);
//     };

//     const handleTranslate = () => {
//         Alert.alert(t('translation_started'), `${t('translating_text')}: ${inputText}`);
//     };

//     const handleSpeechToSign = () => {
//         Alert.alert(t('speech_recognition'), t('speech_to_sign_activated'));
//     };

//     const handleClose = () => {
//         navigation.navigate('Home');
//     };

//     // RTL-aware styles
//     const dynamicStyles = StyleSheet.create({
//         container: {
//             alignItems: isRTL ? 'flex-end' : 'flex-start',
//         },
//         title: {
//             textAlign: isRTL ? 'right' : 'left',
//             writingDirection: isRTL ? 'rtl' : 'ltr',
//         },
//         inputContainer: {
//             flexDirection: isRTL ? 'row-reverse' : 'row',
//         },
//         closeButton: {
//             [isRTL ? 'right' : 'left']: 10,
//         }
//     });

//     const getLanguageLabel = () => {
//         switch(currentLanguage) {
//             case 'en': return 'EN';
//             case 'fr': return 'FR';
//             case 'ar': return 'AR';
//             default: return 'EN';
//         }
//     };

//     return (
//         <LinearGradient 
//             colors={['#88C5A6', '#396F7A']} 
//             style={styles.container}
//         >
//             <SafeAreaView style={[styles.safeArea, dynamicStyles.container]}>
//                 <TouchableOpacity 
//                     onPress={handleClose} 
//                     style={[styles.closeButton, dynamicStyles.closeButton]}
//                 >
//                     <Ionicons name='close-circle' size={40} color='#003C47' />
//                 </TouchableOpacity>
//             </SafeAreaView>

//             <View style={styles.titleContainer}>
//                 <Text style={[styles.title, dynamicStyles.title]}>
//                     {t('text_speech_to_sign')}
//                 </Text>
//             </View>

//             <View style={styles.avatarContainer}>
//                 <Text style={styles.avatarText}>{t('animated_avatar')}</Text>
//             </View>

//             <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
//                 <TextInput
//                     style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
//                     placeholder={t('insert_text_placeholder')}
//                     placeholderTextColor='#888'
//                     value={inputText}
//                     onChangeText={setInputText}
//                 />
//                 <TouchableOpacity 
//                     onPress={toggleLanguage} 
//                     style={styles.languageButton}
//                 >
//                     <FontAwesome5 name='language' size={28} color='#003C47' />
//                     <Text style={styles.languageLabel}>
//                         {getLanguageLabel()}
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity 
//                     onPress={handleSpeechToSign} 
//                     style={styles.micButton}
//                 >
//                     <Ionicons name='mic' size={28} color='#003C47' />
//                 </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//                 onPress={handleTranslate}
//                 style={styles.translateButton}
//             >
//                 <Text style={styles.translateButtonText}>
//                     {t('translate_to_avatar')}
//                 </Text>
//             </TouchableOpacity>

//             <NavBar />
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     safeArea: {
//         width: '100%',
//         paddingTop: 3,
//         position: 'absolute',
//         top: 0,
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 10,
//     },
//     titleContainer: {
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 24,
//         color: '#003C47',
//         backgroundColor: '#B2E8D7',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 20,
//     },
//     avatarContainer: {
//         width: '80%',
//         height: '50%',
//         backgroundColor: '#FFFFFF',
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 20,
//         borderWidth: 4,
//         borderColor: '#A2E9C5'
//     },
//     avatarText: {
//         fontSize: 18,
//         color: '#000'
//     },
//     inputContainer: {
//         width: '80%',
//         height: 60,
//         backgroundColor: '#FFFFFF',
//         borderRadius: 20,
//         paddingHorizontal: 15,
//         alignItems: 'center',
//         borderWidth: 3,
//         borderColor: '#A2E9C5',
//         marginBottom: 20
//     },
//     input: {
//         flex: 1,
//         fontSize: 18,
//         color: '#000'
//     },
//     languageButton: {
//         marginHorizontal: 10,
//         alignItems: 'center'
//     },
//     languageLabel: {
//         fontSize: 12,
//         color: '#003C47',
//         textAlign: 'center'
//     },
//     micButton: {
//         marginHorizontal: 10
//     },
//     translateButton: {
//         backgroundColor: '#003C47',
//         paddingVertical: 12,
//         paddingHorizontal: 40,
//         borderRadius: 20,
//         marginBottom: 20,
//         elevation: 4,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.4,
//         shadowRadius: 5,
//     },
//     translateButtonText: {
//         color: '#FFFFFF',
//         fontSize: 20,
//         fontWeight: 'bold'
//     }
// });

// export default TextOrSpeechToSignScreen;

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NavBar from '../components/NavBar';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLanguage } from '../contexts/LanguageContext';

type TextOrSpeechToSignScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TextOrSpeechToSign'>;

const TextOrSpeechToSignScreen = () => {
    const { t, isRTL } = useLanguage();
    const [inputText, setInputText] = useState('');
    const [translationLanguage, setTranslationLanguage] = useState('en');
    const navigation = useNavigation<TextOrSpeechToSignScreenNavigationProp>();

    // Toggle between Arabic, French, and English (only for translation)
    const toggleLanguage = () => {
        const languages = ['en', 'fr', 'ar'];
        const currentIndex = languages.indexOf(translationLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLanguage = languages[nextIndex];
        setTranslationLanguage(nextLanguage);
    };

    const handleTranslate = () => {
        Alert.alert(t('translation_started'), `${t('translating_text')}: ${inputText}`);
    };

    const handleSpeechToSign = () => {
        Alert.alert(t('speech_recognition'), t('speech_to_sign_activated'));
    };

    const handleClose = () => {
        navigation.navigate('Home');
    };

    // RTL-aware styles
    const dynamicStyles = StyleSheet.create({
        container: {
            alignItems: isRTL ? 'flex-end' : 'flex-start',
        },
        title: {
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr',
        },
        inputContainer: {
            flexDirection: isRTL ? 'row-reverse' : 'row',
        },
        closeButton: {
            [isRTL ? 'right' : 'left']: 10,
        }
    });

    const getLanguageLabel = () => {
        switch(translationLanguage) {
            case 'en': return 'EN';
            case 'fr': return 'FR';
            case 'ar': return 'AR';
            default: return 'EN';
        }
    };

    return (
        <LinearGradient 
            colors={['#88C5A6', '#396F7A']} 
            style={styles.container}
        >
            <SafeAreaView style={[styles.safeArea, dynamicStyles.container]}>
                <TouchableOpacity 
                    onPress={handleClose} 
                    style={[styles.closeButton, dynamicStyles.closeButton]}
                >
                    <Ionicons name='close-circle' size={40} color='#003C47' />
                </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.titleContainer}>
                <Text style={[styles.title, dynamicStyles.title]}>
                    {t('text_speech_to_sign')}
                </Text>
            </View>

            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{t('animated_avatar')}</Text>
            </View>

            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
                <TextInput
                    style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                    placeholder={t('insert_text_placeholder')}
                    placeholderTextColor='#888'
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity 
                    onPress={toggleLanguage} 
                    style={styles.languageButton}
                >
                    <FontAwesome5 name='language' size={28} color='#003C47' />
                    <Text style={styles.languageLabel}>
                        {getLanguageLabel()}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={handleSpeechToSign} 
                    style={styles.micButton}
                >
                    <Ionicons name='mic' size={28} color='#003C47' />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                onPress={handleTranslate}
                style={styles.translateButton}
            >
                <Text style={styles.translateButtonText}>
                    {t('translate_to_avatar')}
                </Text>
            </TouchableOpacity>

            <NavBar />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        width: '100%',
        paddingTop: 3,
        position: 'absolute',
        top: 0,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
    },
    titleContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#003C47',
        backgroundColor: '#B2E8D7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    avatarContainer: {
        width: '80%',
        height: '50%',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 4,
        borderColor: '#A2E9C5'
    },
    avatarText: {
        fontSize: 18,
        color: '#000'
    },
    inputContainer: {
        width: '80%',
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#A2E9C5',
        marginBottom: 20
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#000'
    },
    languageButton: {
        marginHorizontal: 10,
        alignItems: 'center'
    },
    languageLabel: {
        fontSize: 12,
        color: '#003C47',
        textAlign: 'center'
    },
    micButton: {
        marginHorizontal: 10
    },
    translateButton: {
        backgroundColor: '#003C47',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 20,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    translateButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default TextOrSpeechToSignScreen;