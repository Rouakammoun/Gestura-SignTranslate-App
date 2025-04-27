import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import NavBar from '../components/NavBar';
import { RootStackParamList } from '../navigation/types';

// Continuously record 2-second clips when this screen is active
const PREDICTION_THRESHOLD = 0.4;
const CLIP_DURATION_SEC = 2;

type Props = NativeStackScreenProps<RootStackParamList, 'SignToText'>;

const SignToTextScreen: React.FC<Props> = ({ route, navigation }) => {
  const [cameraReady, setCameraReady] = useState(false);
  const { language } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [lastPrediction, setLastPrediction] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState('Translated text will appear here');
  const [facing, setFacing] = useState<CameraType>('back');

  // Flag controlling loop
  const activeRef = useRef(true);

  useEffect(() => {
    activeRef.current = true;
  
    const askPermissions = async () => {
      await requestPermission();
      await Audio.requestPermissionsAsync();
    };
  
    askPermissions();
  
    return () => {
      activeRef.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (permission?.granted && cameraReady) {
      recordLoop(); // Only start loop after camera is ready
    }
  }, [permission?.granted, cameraReady]);

  // Recursively record clip then schedule next
  const recordLoop = async () => {
    if (!activeRef.current || !permission?.granted || !cameraRef.current) return;
  
    try {
      console.log('Start recording...');
      const recordingPromise = cameraRef.current.recordAsync();
  
      setTimeout(async () => {
        console.log('Stopping recording...');
        cameraRef.current?.stopRecording();
  
        try {
          const clip = await recordingPromise;
          if (clip?.uri) {
            console.log('Clip ready:', clip.uri);
            await sendClip(clip.uri);
          }
        } catch (err) {
          console.error('Error while handling clip:', err);
        }
  
        // After one recording cycle is finished, start next
        setTimeout(recordLoop, 1000);
  
      }, CLIP_DURATION_SEC * 1000); // Stop after 2 seconds
    } catch (e) {
      console.error('Recording error:', e);
      // Retry after small delay if something went wrong
      setTimeout(recordLoop, 300);
    }
  };
  const sendClip = async (uri: string) => {
    try {
      const form = new FormData();
      form.append('video', { uri, type: 'video/mp4', name: 'clip.mp4' } as any);
      form.append('language', language);
      const res = await fetch('http://192.168.1.186:5000/translate_video', {
        method: 'POST', headers: { 'Content-Type': 'multipart/form-data' }, body: form
      });
      const { prediction, confidence } = await res.json();
      if (prediction && confidence > PREDICTION_THRESHOLD && prediction !== lastPrediction) {
        setTranslatedText(prev => prev === 'Translated text will appear here' ? prediction : prev + ' ' + prediction);
        setLastPrediction(prediction);
      }
    } catch (e) {
      console.error('Translation API error:', e);
    }
  };

  const toggleFacing = () => setFacing(f => f === 'back' ? 'front' : 'back');
  const goHome = () => { activeRef.current = false; navigation.navigate('Home'); };

  const speakTranslation = () => {
    if (translatedText ) {
      Speech.speak(translatedText, {
        language: language === 'French' ? 'fr-FR' : 'en-US',
        pitch: 1.1,
        rate: 0.9,
      });
    }
  };

  if (!permission) return <ActivityIndicator style={styles.centered} />;
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Camera & microphone permissions required</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#88C5A6','#396F7A']} style={styles.container}>
      <TouchableOpacity onPress={goHome} style={styles.closeButton}>
        <Ionicons name="close-circle" size={40} color="#003C47"/>
      </TouchableOpacity>
      <Text style={styles.title}>Sign To Text ({language})</Text>

      <View style={styles.cameraContainer}>
      <CameraView
  ref={cameraRef}
  style={styles.camera}
  mode="video"
  facing={facing}
  ratio="4:3"
  onCameraReady={() => {
    setCameraReady(true);
  }}
/>

        <TouchableOpacity onPress={toggleFacing} style={styles.toggleButton}>
          <Ionicons name="camera-reverse" size={30} color="#003C47"/>
        </TouchableOpacity>
      </View>

      <View style={styles.translationBox}>
        <Text style={styles.translatedText}>{translatedText}</Text>
        <TouchableOpacity onPress={speakTranslation} style={{marginTop:10}}>
          <Ionicons name="volume-high" size={24} color="#003C47"/>
        </TouchableOpacity>
      </View>

      <NavBar/>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {flex:1,justifyContent:'center',alignItems:'center'},
  centered: {flex:1,justifyContent:'center',alignItems:'center'},
  closeButton:{position:'absolute',top:40,left:20},
  title:{fontSize:24,color:'#003C47',backgroundColor:'#B2E8D7',padding:10,borderRadius:20,marginBottom:10},
  cameraContainer: {
    width: '76%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  camera:{flex:1,borderRadius:20,borderWidth:4,borderColor:'#A2E9C5',overflow:'hidden'},
  toggleButton:{position:'absolute',top:10,left:10,backgroundColor:'#FFF',padding:5,borderRadius:20,borderWidth:2,borderColor:'#A2E9C5'},
  translationBox:{width:'80%',backgroundColor:'#FFF',borderRadius:20,padding:10,alignItems:'center',borderWidth:2,borderColor:'#A2E9C5'},
  translatedText:{color:'#000',fontSize:16,textAlign:'center'},
  permissionText:{fontSize:18,marginBottom:20},
  permissionButton:{backgroundColor:'#A2E9C5',padding:10,borderRadius:10},
  permissionButtonText:{fontSize:16,color:'#003C47'}
});

export default SignToTextScreen;