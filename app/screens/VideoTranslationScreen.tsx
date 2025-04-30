// import React, { useState, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { RNCamera } from 'react-native-camera';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import { useNavigation } from '@react-navigation/native';
// import NavBar from '../components/NavBar';

// const VideoTranslationScreen = () => {
//   const navigation = useNavigation();
//   const [cameraOpen, setCameraOpen] = useState(false);
//   const [videoUri, setVideoUri] = useState<string | null>(null);
//   const [translatedText, setTranslatedText] = useState("");
//   const cameraRef = useRef<RNCamera | null>(null);

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   const handleTranslation = () => {
//     setTranslatedText("This is the translated text from the video.");
//   };

//   const pickVideoFromGallery = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (result && result.assets && result.assets[0].uri) {
//       setVideoUri(result.assets[0].uri);
//       setCameraOpen(false);
//     }
//   };

//   const startRecording = async () => {
//     if (cameraRef.current) {
//       const options = { quality: RNCamera.Constants.VideoStabilization.standard, maxDuration: 60 };
//       const data = await cameraRef.current.recordAsync(options);
//       setVideoUri(data.uri);
//     }
//   };

//   const stopRecording = () => {
//     if (cameraRef.current) {
//       cameraRef.current.stopRecording();
//     }
//   };

//   return (
//     <LinearGradient colors={['#88C5A6', '#396F7A']} style={styles.container}>
//       {/* Close button in top left */}
//       <TouchableOpacity onPress={handleGoBack} style={styles.closeButton}>
//         <Ionicons name="close" size={32} color="#003C47" />
//       </TouchableOpacity>

//       {/* Header */}
//       <View style={styles.headerBox}>
//         <Text style={styles.header}>Video Translation</Text>
//       </View>

//       {/* Video selection buttons */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.actionButton} onPress={pickVideoFromGallery}>
//           <Ionicons name="folder-open" size={24} color="#003C47" />
//           <Text style={styles.buttonText}>Upload Video</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.actionButton} 
//           onPress={() => {
//             setCameraOpen(true);
//             setVideoUri(null);
//           }}
//         >
//           <Ionicons name="videocam" size={24} color="#003C47" />
//           <Text style={styles.buttonText}>Record Video</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Video display area */}
//       <View style={styles.videoContainer}>
//         {cameraOpen && !videoUri ? (
//           <>
//             <RNCamera
//               style={styles.camera}
//               type={RNCamera.Constants.Type.back}
//               ref={cameraRef}
//               captureAudio={true}
//             />
//             <View style={styles.recordingControls}>
//               <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
//                 <Ionicons name="radio-button-on" size={40} color="#FF0000" />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
//                 <Ionicons name="square" size={30} color="#003C47" />
//               </TouchableOpacity>
//             </View>
//           </>
//         ) : videoUri ? (
//           <>
//             <Text style={styles.videoPlaceholder}>Video selected/recorded</Text>
//             <TouchableOpacity style={styles.translateButton} onPress={handleTranslation}>
//               <Ionicons name="language" size={24} color="#003C47" />
//               <Text style={styles.buttonText}>Translate to Text</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <Text style={styles.videoPlaceholder}>No video selected</Text>
//         )}
//       </View>

//       {/* Translation result */}
//       <View style={styles.textContainer}>
//         <Text style={styles.translatedText}>
//           {translatedText || "Translated text will appear here"}
//         </Text>
//         <TouchableOpacity style={styles.speakButton}>
//           <Ionicons name="volume-high" size={24} color="#003C47" />
//         </TouchableOpacity>
//       </View>

//       <NavBar />
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 40,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 1,
//   },
//   headerBox: {
//     backgroundColor: '#B2E8D7',
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 20,
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: '#A2E9C5',
//   },
//   header: {
//     fontSize: 24,
//     color: '#003C47',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     width: '90%',
//     marginBottom: 20,
//     paddingRight: 15,
//     gap: 5,
//   },
//   actionButton: {
//     backgroundColor: '#B2E8D7',
//     padding: 15,
//     borderRadius: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#A2E9C5',
//   },
//   buttonText: {
//     color: '#003C47',
//     fontSize: 16,
//     marginLeft: 10,
//     fontWeight: 'bold',
//   },
//   videoContainer: {
//     width: '80%',
//     height: 200,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 4,
//     borderColor: '#A2E9C5',
//     marginBottom: 20,
//   },
//   camera: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 15,
//   },
//   recordingControls: {
//     position: 'absolute',
//     bottom: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '60%',
//   },
//   recordButton: {
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 50,
//     padding: 10,
//   },
//   stopButton: {
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 50,
//     padding: 10,
//   },
//   videoPlaceholder: {
//     color: '#003C47',
//     fontSize: 16,
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   translateButton: {
//     backgroundColor: '#B2E8D7',
//     padding: 15,
//     borderRadius: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#A2E9C5',
//   },
//   textContainer: {
//     width: '80%',
//     minHeight: 100,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     borderWidth: 4,
//     borderColor: '#A2E9C5',
//     marginBottom: 20,
//   },
//   translatedText: {
//     color: '#003C47',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   speakButton: {
//     marginTop: 15,
//     backgroundColor: '#B2E8D7',
//     borderRadius: 50,
//     padding: 10,
//     borderWidth: 2,
//     borderColor: '#A2E9C5',
//   },
// });

// export default VideoTranslationScreen;

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';
import NavBar from '../components/NavBar';

const VideoTranslationScreen = () => {
  const navigation = useNavigation();
  const { t, isRTL } = useLanguage();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState("");
  const cameraRef = useRef<RNCamera | null>(null);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleTranslation = () => {
    setTranslatedText(t('translation_placeholder'));
  };

  const pickVideoFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (result && result.assets && result.assets[0].uri) {
      setVideoUri(result.assets[0].uri);
      setCameraOpen(false);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      const options = { quality: RNCamera.Constants.VideoStabilization.standard, maxDuration: 60 };
      const data = await cameraRef.current.recordAsync(options);
      setVideoUri(data.uri);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  // RTL-aware styles
  const dynamicStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: 40,
    },
    closeButton: {
      left: isRTL ? undefined : 20,
      right: isRTL ? 20 : undefined,
    },
    buttonContainer: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    actionButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    buttonText: {
      marginLeft: isRTL ? 0 : 10,
      marginRight: isRTL ? 10 : 0,
      textAlign: isRTL ? 'right' : 'left',
    },
    header: {
      textAlign: isRTL ? 'right' : 'center',
    },
    translatedText: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    translateButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    }
  });

  return (
    <LinearGradient colors={['#88C5A6', '#396F7A']} style={[styles.container, dynamicStyles.container]}>
      {/* Close button in top left */}
      <TouchableOpacity onPress={handleGoBack} style={[styles.closeButton, dynamicStyles.closeButton]}>
        <Ionicons name="close" size={32} color="#003C47" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={[styles.header, dynamicStyles.header]}>{t('video_translation')}</Text>
      </View>

      {/* Video selection buttons */}
      <View style={[styles.buttonContainer, dynamicStyles.buttonContainer]}>
        <TouchableOpacity style={[styles.actionButton, dynamicStyles.actionButton]} onPress={pickVideoFromGallery}>
          <Ionicons name="folder-open" size={24} color="#003C47" />
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>{t('upload_video')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, dynamicStyles.actionButton]} 
          onPress={() => {
            setCameraOpen(true);
            setVideoUri(null);
          }}
        >
          <Ionicons name="videocam" size={24} color="#003C47" />
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>{t('record_video')}</Text>
        </TouchableOpacity>
      </View>

      {/* Video display area */}
      <View style={styles.videoContainer}>
        {cameraOpen && !videoUri ? (
          <>
            <RNCamera
              style={styles.camera}
              type={RNCamera.Constants.Type.back}
              ref={cameraRef}
              captureAudio={true}
            />
            <View style={styles.recordingControls}>
              <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
                <Ionicons name="radio-button-on" size={40} color="#FF0000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
                <Ionicons name="square" size={30} color="#003C47" />
              </TouchableOpacity>
            </View>
          </>
        ) : videoUri ? (
          <>
            <Text style={styles.videoPlaceholder}>{t('video_selected')}</Text>
            <TouchableOpacity style={[styles.translateButton, dynamicStyles.translateButton]} onPress={handleTranslation}>
              <Ionicons name="language" size={24} color="#003C47" />
              <Text style={[styles.buttonText, dynamicStyles.buttonText]}>{t('translate_to_text')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.videoPlaceholder}>{t('no_video_selected')}</Text>
        )}
      </View>

      {/* Translation result */}
      <View style={styles.textContainer}>
        <Text style={[styles.translatedText, dynamicStyles.translatedText]}>
          {translatedText || t('translation_will_appear')}
        </Text>
        <TouchableOpacity style={styles.speakButton}>
          <Ionicons name="volume-high" size={24} color="#003C47" />
        </TouchableOpacity>
      </View>

      <NavBar />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    zIndex: 1,
  },
  headerBox: {
    backgroundColor: '#B2E8D7',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#A2E9C5',
  },
  header: {
    fontSize: 24,
    color: '#003C47',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',   // center horizontally
    alignItems: 'center',       // center vertically (if needed)
    width: '90%',
    marginBottom: 25,
    gap: 10, 
    flexWrap: 'wrap',                   // (optional) little gap between buttons
  },
  
  actionButton: {
    backgroundColor: '#B2E8D7',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A2E9C5',
    maxWidth: 150,  // Ensure the button does not stretch too much
  flex: 1,      
  },
  buttonText: {
    color: '#003C47',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoContainer: {
    width: '80%',
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#A2E9C5',
    marginBottom: 20,
  },
  camera: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  recordingControls: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  recordButton: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 50,
    padding: 10,
  },
  stopButton: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 50,
    padding: 10,
  },
  videoPlaceholder: {
    color: '#003C47',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  translateButton: {
    backgroundColor: '#B2E8D7',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A2E9C5',
  },
  textContainer: {
    width: '80%',
    minHeight: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 4,
    borderColor: '#A2E9C5',
    marginBottom: 20,
  },
  translatedText: {
    color: '#003C47',
    fontSize: 16,
  },
  speakButton: {
    marginTop: 15,
    backgroundColor: '#B2E8D7',
    borderRadius: 50,
    padding: 10,
    borderWidth: 2,
    borderColor: '#A2E9C5',
  },
});

export default VideoTranslationScreen;