// import { useState } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../navigation/types'; // Adjust the import according to your project structure

// // Define the type for navigation prop
// type ModeSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModeSelection'>;

// export default function ModeSelectionScreen() {
//   const [selectedMode, setSelectedMode] = useState<string | null>(null);

//   // Use the navigation prop with correct typing
//   const navigation = useNavigation<ModeSelectionScreenNavigationProp>();

//   // Navigate to the next screen (e.g., 'HomeScreen') after selecting a mode
//   const handleContinue = () => {
//     if (selectedMode) {
//       navigation.navigate('SetLanguage'); // Replace with the actual screen you want to navigate to
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.contentContainer}>
//         {/* Image at the top */}
//         <Image 
//           source={require('../assets/mode-selection-graphic.jpg')}
//           style={styles.image}
//           resizeMode="contain"
//         />

//         {/* Mode selection buttons */}
//         <View style={styles.modeButtonsContainer}>
//           <TouchableOpacity 
//             style={[styles.modeButton, selectedMode === 'deaf' && styles.selectedMode]}
//             onPress={() => setSelectedMode('deaf')}
//           >
//             <Ionicons name="volume-mute-outline" size={32} color="#25596E" />
//             <Text style={styles.modeText}>Deaf</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={[styles.modeButton, selectedMode === 'hearing' && styles.selectedMode]}
//             onPress={() => setSelectedMode('hearing')}
//           >
//             <Ionicons name="ear-outline" size={32} color="#25596E" />
//             <Text style={styles.modeText}>Hearing</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Continue button - only visible when a mode is selected */}
//         {selectedMode && (
//           <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
//             <Text style={styles.continueText}>Continue</Text>
//             <Ionicons name="arrow-forward" size={20} color="white" style={styles.arrowIcon} />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   contentContainer: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 32,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//     alignItems: 'center',
//   },
//   image: {
//     width: 180,
//     height: 120,
//     marginBottom: 32,
//   },
//   modeButtonsContainer: {
//     width: '100%',
//     marginBottom: 32,
//   },
//   modeButton: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F8F8F8',
//     paddingVertical: 18,
//     paddingHorizontal: 24,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   selectedMode: {
//     borderColor: '#00819E',
//     backgroundColor: '#E6F4F8',
//   },
//   modeText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#25596E',
//     marginLeft: 12,
//   },
//   continueButton: {
//     width: '100%',
//     backgroundColor: '#00819E',
//     paddingVertical: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#00819E',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   continueText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   arrowIcon: {
//     marginLeft: 8,
//   },
// });

import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useLanguage } from '../contexts/LanguageContext';

type ModeSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ModeSelection'>;

const ModeSelectionScreen = () => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const navigation = useNavigation<ModeSelectionScreenNavigationProp>();
  const { t, isRTL } = useLanguage();

  const handleContinue = () => {
    if (selectedMode) {
      navigation.navigate('SetLanguage');
    }
  };

  // RTL-aware styles
  const dynamicStyles = StyleSheet.create({
    contentContainer: {
      alignItems: 'center',
    },
    modeButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    modeText: {
      marginLeft: isRTL ? 0 : 12,
      marginRight: isRTL ? 12 : 0,
      textAlign: isRTL ? 'right' : 'left',
    },
    continueButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    arrowIcon: {
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
      transform: [{ scaleX: isRTL ? -1 : 1 }]
    }
  });

  return (
    <View style={styles.container}>
      <View style={[styles.contentContainer, dynamicStyles.contentContainer]}>
        <Image 
          source={require('../assets/mode-selection-graphic.jpg')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.modeButtonsContainer}>
          <TouchableOpacity 
            style={[
              styles.modeButton, 
              dynamicStyles.modeButton,
              selectedMode === 'deaf' && styles.selectedMode
            ]}
            onPress={() => setSelectedMode('deaf')}
          >
            <Ionicons name="volume-mute-outline" size={32} color="#25596E" />
            <Text style={[styles.modeText, dynamicStyles.modeText]}>
              {t('deaf_mode')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.modeButton, 
              dynamicStyles.modeButton,
              selectedMode === 'hearing' && styles.selectedMode
            ]}
            onPress={() => setSelectedMode('hearing')}
          >
            <Ionicons name="ear-outline" size={32} color="#25596E" />
            <Text style={[styles.modeText, dynamicStyles.modeText]}>
              {t('hearing_mode')}
            </Text>
          </TouchableOpacity>
        </View>

        {selectedMode && (
          <TouchableOpacity 
            style={[styles.continueButton, dynamicStyles.continueButton]} 
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>{t('continue')}</Text>
            <Ionicons 
              name={isRTL ? "arrow-back" : "arrow-forward"} 
              size={20} 
              color="white" 
              style={dynamicStyles.arrowIcon} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 24,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 180,
    height: 120,
    marginBottom: 32,
    alignSelf: 'center',
  },
  modeButtonsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  modeButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedMode: {
    borderColor: '#00819E',
    backgroundColor: '#E6F4F8',
  },
  modeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#25596E',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#00819E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00819E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ModeSelectionScreen;