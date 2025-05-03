// import React, { useRef, useState } from 'react';
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// export default function LearnMoreScreen() {
//   const videoRef = useRef<Video>(null);
//   const [status, setStatus] = useState<AVPlaybackStatus>({ isLoaded: false });
//   const screenWidth = Dimensions.get('window').width;

//   const isPlaying = status.isLoaded ? status.isPlaying : false;
//   const navigation = useNavigation();

//   const handleBack = () => {
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.backgroundImage}>
//       <View style={styles.overlay}>
//         <View style={styles.contentContainer}>
//           <Text style={styles.title}>Gestura Tutorial</Text>

//           <View style={styles.videoContainer}>
//             <Video
//               ref={videoRef}
//               style={[styles.video, { width: screenWidth - 60 }]}
//               source={require('../assets/tutorial.mp4')}
//               useNativeControls
//               resizeMode={ResizeMode.CONTAIN}
//               isLooping
//               onPlaybackStatusUpdate={setStatus}
//             />
//           </View>

//           <Text style={styles.content}>
//             Watch this short tutorial to learn how to use Gestura effectively.
//           </Text>

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={[styles.button, styles.playButton]}
//               onPress={() =>
//                 isPlaying
//                   ? videoRef.current?.pauseAsync()
//                   : videoRef.current?.playAsync()
//               }
//             >
//               <View style={styles.buttonContent}>
//                 <Ionicons 
//                   name={isPlaying ? 'pause' : 'play'} 
//                   size={20} 
//                   color="white" 
//                 />
//                 <Text style={styles.buttonText}>
//                   {isPlaying ? 'Pause' : 'Play'}
//                 </Text>
//               </View>
//             </TouchableOpacity>

//             <View style={styles.backButtonContainer}>
//               <TouchableOpacity style={styles.button} onPress={handleBack}>
//                 <Text style={[styles.buttonText, { paddingHorizontal: 20 }]}>
//                   Back
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'white',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   contentContainer: {
//     backgroundColor: '#89c6a7',
//     borderRadius: 16,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//     color: '#25596E',
//   },
//   videoContainer: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   video: {
//     height: 180,
//     borderRadius: 12,
//     backgroundColor: '#000',
//   },
//   content: {
//     fontSize: 16,
//     marginBottom: 32,
//     textAlign: 'center',
//     lineHeight: 24,
//     paddingHorizontal: 16,
//     color: '#25596E',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 12,
//   },
//   button: {
//     minWidth: 120,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#25596E',
//   },
//   playButton: {
//     backgroundColor: '#00819e',
//   },
//   backButtonContainer: {
//     borderRadius: 8,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, I18nManager } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';

// Remove the duplicate export default and keep only one
const LearnMoreScreen = () => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>({ isLoaded: false });
  const screenWidth = Dimensions.get('window').width;
  const { t, isRTL } = useLanguage();
  const navigation = useNavigation();

  const isPlaying = status.isLoaded ? status.isPlaying : false;

  const handleBack = () => {
    navigation.goBack();
  };

  // RTL-aware styles
  const dynamicStyles = StyleSheet.create({
    contentContainer: {
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    title: {
      textAlign: isRTL ? 'right' : 'center',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    content: {
      textAlign: isRTL ? 'right' : 'center',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    buttonContainer: {
      flexDirection: isRTL ? 'row' : 'row',
    },
    buttonContent: {
      flexDirection: isRTL ? 'row-reverse' : 'row-reverse',
    }
  });

  return (
    <View style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={[styles.contentContainer, dynamicStyles.contentContainer]}>
          <Text style={[styles.title, dynamicStyles.title]}>
            {t('tutorial_title')}
          </Text>

          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              style={[styles.video, { width: screenWidth - 60 }]}
              source={require('../assets/tutorial.mp4')}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              onPlaybackStatusUpdate={setStatus}
            />
          </View>

          <Text style={[styles.content, dynamicStyles.content]}>
            {t('tutorial_description')}
          </Text>

          <View style={[styles.buttonContainer, dynamicStyles.buttonContainer]}>
            <TouchableOpacity
              style={[styles.button, styles.playButton]}
              onPress={() =>
                isPlaying
                  ? videoRef.current?.pauseAsync()
                  : videoRef.current?.playAsync()
              }
            >
              <View style={dynamicStyles.buttonContent}>
                <Ionicons 
                  name={isPlaying ? 'pause' : 'play'} 
                  size={20} 
                  color="white" 
                />
                <Text style={styles.buttonText}>
                  {isPlaying ? t('pause') : t('play')}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.backButtonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleBack}>
                <Text style={[styles.buttonText, { paddingHorizontal: 20 }]}>
                  {t('back')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Static styles
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    backgroundColor: '#89c6a7',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#25596E',
    textAlign: 'center', // This centers the text horizontally
    alignSelf: 'center', // This centers the text within its container
    width: '100%',
  },
  videoContainer: {
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
    marginBottom: 24,
    width: '100%', // Ensure container takes full width
  },
  video: {
    height: 180,
    width: '90%', // Or set a fixed width like 320
    borderRadius: 12,
    backgroundColor: '#000',
    alignSelf: 'center', // Additional centering for the video itself
  },
  content: {
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
    color: '#25596E',
  },
  buttonContainer: {
    flexDirection: 'row',       // Horizontal layout
    justifyContent: 'center',   // Center horizontally
    alignItems: 'center',       // Center vertically
    gap: 2,                    // Space between buttons
    width: '100%',              // Take full width
    paddingHorizontal: 10,      // Add side padding
    marginVertical: 16,         // Vertical spacing
  },
  button: {
    minWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 19,      // Added horizontal padding
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25596E',
    flex: 1,                    
    maxWidth: 160,              
  },
  playButton: {
    backgroundColor: '#00819e',
    minWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 40,      // Added horizontal padding
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,                    
    maxWidth: 130,          
  },
  backButtonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    flex: 1,                    
    maxWidth: 160,              
  },
  buttonContent: {
    flexDirection: 'row',       
    alignItems: 'center',
    justifyContent: 'center',   
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',        
  },
});

// Only one export default at the end of the file
export default LearnMoreScreen;