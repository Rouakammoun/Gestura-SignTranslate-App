import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Ionicons } from '@expo/vector-icons';  // Make sure to install this if not already installed

const VideoTranslationScreen = () => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [translatedText, setTranslatedText] = useState(""); // To store the translated text

  const handleTranslation = () => {
    // Example translation result
    setTranslatedText("This is the translated text from the video.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.header}>Video Translation</Text>
      </View>
      <View style={styles.videoBox}>
        {cameraOpen ? (
          <RNCamera
            style={styles.camera}
            type={RNCamera.Constants.Type.back}
          />
        ) : (
          <TouchableOpacity style={styles.cameraBox} onPress={() => setCameraOpen(true)}>
            <Text style={styles.cameraText}>Open Camera</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleTranslation}>
        <Text style={styles.buttonText}>Translate to Text</Text>
      </TouchableOpacity>
      {/* Non-editable text box */}
      <TextInput
        style={styles.textBox}
        value={translatedText}
        editable={false} // Makes the text box non-editable
        placeholder="Translated text will appear here"
      />
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Home Button Pressed')}>
          <Ionicons name="home-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Profile Button Pressed')}>
          <Ionicons name="person-outline" size={30} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => console.log('Feedback Button Pressed')}>
          <Ionicons name="chatbubble-outline" size={30} color="#333" />
        </TouchableOpacity>
      </View>
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
  videoBox: { width: '80%', height: 200, backgroundColor: 'white', borderRadius: 10, marginVertical: 10 },
  button: {
    backgroundColor: '#25596E', // Button color
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
    margin: 10,
  },
  buttonText: { color: 'white', fontSize: 16 },
  cameraBox: { width: '80%', height: 100, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  cameraText: { color: 'gray', fontSize: 16 },
  camera: { width: '100%', height: '100%' },
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
