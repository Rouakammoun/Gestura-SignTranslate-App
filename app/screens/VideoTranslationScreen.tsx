import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Ionicons } from '@expo/vector-icons'; // Ensure this is installed if not already
import * as ImagePicker from 'expo-image-picker';
import NavBar from '../components/NavBar';

const VideoTranslationScreen = () => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null); // Store the video URI
  const [translatedText, setTranslatedText] = useState(""); // Store translated text
  const cameraRef = useRef<RNCamera | null>(null);

  const handleTranslation = () => {
    // Example translation result
    setTranslatedText("This is the translated text from the video.");
  };

  const pickVideoFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    // Corrected the property from 'cancelled' to 'canceled' and ensured we access the URI properly
    if (result && result.assets && result.assets[0].uri) {
      setVideoUri(result.assets[0].uri); // Set the video URI from the gallery
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      const options = { quality: RNCamera.Constants.VideoStabilization.standard, maxDuration: 60 };
      const data = await cameraRef.current.recordAsync(options);
      setVideoUri(data.uri); // Set the recorded video URI
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.header}>Video Translation</Text>
      </View>

      {/* Select between Uploading from Gallery or Recording Video */}
      <View style={styles.selectionBox}>
        <TouchableOpacity style={styles.selectionButton} onPress={pickVideoFromGallery}>
          <Text style={styles.selectionText}>Upload Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectionButton} onPress={() => setCameraOpen(true)}>
          <Text style={styles.selectionText}>Record Video</Text>
        </TouchableOpacity>
      </View>

      {/* Show the camera if the user chooses to record a video */}
      {cameraOpen && !videoUri ? (
        <View style={styles.videoBox}>
          <RNCamera
            style={styles.camera}
            type={RNCamera.Constants.Type.back}
            ref={cameraRef}
            captureAudio={true}
          />
          <TouchableOpacity
            style={styles.recordButton}
            onPress={startRecording}
          >
            <Ionicons name="videocam" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.stopButton}
            onPress={stopRecording}
          >
            <Ionicons name="square" size={30} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        // Show the uploaded or recorded video
        videoUri && (
          <View style={styles.videoBox}>
            <Text style={styles.videoText}>Video selected/recorded</Text>
            <TouchableOpacity style={styles.button} onPress={handleTranslation}>
              <Text style={styles.buttonText}>Translate to Text</Text>
            </TouchableOpacity>
          </View>
        )
      )}

      {/* Non-editable text box for translated text */}
      <TextInput
        style={styles.textBox}
        value={translatedText}
        editable={false} // Makes the text box non-editable
        placeholder="Translated text will appear here"
      />

      <NavBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#B7E0D4' },
  headerBox: {
    backgroundColor: '#25596E', // Match button color for the header
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 40,  // Adjust to lower the header
    marginBottom: 20,
  },
  header: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold', 
  },
  selectionBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '80%', 
    marginVertical: 10 
  },
  selectionButton: { 
    backgroundColor: '#25596E', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 25 
  },
  selectionText: { 
    color: 'white', 
    fontSize: 16 
  },
  videoBox: { 
    width: '80%', 
    height: 200, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: { 
    width: '100%', 
    height: '100%' 
  },
  recordButton: { 
    position: 'absolute', 
    bottom: 20, 
    left: '35%' 
  },
  stopButton: { 
    position: 'absolute', 
    bottom: 20, 
    right: '35%' 
  },
  videoText: { 
    color: 'gray', 
    fontSize: 16 
  },
  button: {
    backgroundColor: '#25596E', // Button color
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
    margin: 10,
  },
  buttonText: { color: 'white', fontSize: 16 },
  textBox: {
    width: '80%',
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    fontSize: 16,
    color: 'gray',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  navbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    elevation: 5,
  },
  navButton: {
    alignItems: 'center',
  },
});

export default VideoTranslationScreen;
