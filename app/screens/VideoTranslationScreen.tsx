import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import NavBar from '../components/NavBar';
import { Picker } from '@react-native-picker/picker';

const VideoTranslationScreen = () => {
  const navigation = useNavigation();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState("");
  const cameraRef = useRef<RNCamera | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('ASL');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleTranslation = () => {
    setTranslatedText("This is the translated text from the video.");
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

  return (
    <LinearGradient colors={['#88C5A6', '#396F7A']} style={styles.container}>
      {/* Close button in top left */}
      <TouchableOpacity onPress={handleGoBack} style={styles.closeButton}>
        <Ionicons name="close" size={32} color="#003C47" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.header}>Video Translation</Text>
      </View>

      {/* Video selection buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={pickVideoFromGallery}>
          <Ionicons name="folder-open" size={24} color="#003C47" />
          <Text style={styles.buttonText}>Upload Video</Text>
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
            <Text style={styles.videoPlaceholder}>Video selected</Text>
            <TouchableOpacity style={styles.translateButton} onPress={handleTranslation}>
              <Ionicons name="language" size={24} color="#003C47" />
              <Text style={styles.buttonText}>Translate to Text</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.videoPlaceholder}>No video selected</Text>
        )}
      </View>
      <View style={styles.pickerContainer}>
  <Picker
    selectedValue={selectedLanguage}
    onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
    style={styles.picker}
    dropdownIconColor="#003C47"
  >
    <Picker.Item label="ASL (American Sign Language)" value="ASL" />
    <Picker.Item label="ARSL (Arabic Sign Language)" value="ARSL" />
    <Picker.Item label="TunSL (Tunisian Sign Language)" value="TunSL" />
  </Picker>
</View>

      {/* Translation result */}
      <View style={styles.textContainer}>
        <Text style={styles.translatedText}>
          {translatedText || "Translated text will appear here"}
        </Text>
        <TouchableOpacity style={styles.speakButton}>
          <Ionicons name="volume-high" size={20} color="#003C47" />
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
    alignItems: 'center',
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  headerBox: {
    backgroundColor: '#B2E8D7',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#A2E9C5',
  },
  header: {
    fontSize: 26,
    color: '#003C47',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // center horizontally
    width: '100%',
    marginBottom: 20,
    gap: 5,
  },
  actionButton: {
    backgroundColor: '#B2E8D7',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A2E9C5',
  },
  buttonText: {
    justifyContent:'center',
    color: '#003C47',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  videoContainer: {
    width: '80%',
    height: 120,
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
    borderRadius: 40,
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A2E9C5',
  },
  textContainer: {
    width: '80%',
    height:'20%',
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
    fontSize: 18,
    textAlign: 'center',
  },
  speakButton: {
    marginTop: 23,
    backgroundColor: '#B2E8D7',
    borderRadius: 50,
    padding: 10,
    borderWidth: 2,
    borderColor: '#A2E9C5',
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: '#B2E8D7',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#A2E9C5',
  },
  picker: {
    color: '#003C47',
    height: 50,
    width: '100%',
  },
  
});

export default VideoTranslationScreen;