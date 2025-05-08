// Add these declarations in a global .d.ts file or at the top of this file
// to satisfy TypeScript for modules without types
declare module 'expo-video-thumbnails';
declare module 'react-native-tflite';

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
// require the module to ensure functions are available
// require the module correctly
const TfliteModule = require('react-native-tflite').default || require('react-native-tflite');
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import NavBar from '../components/NavBar';

const tflite = new TfliteModule();

export default function VideoTranslationScreen({ navigation }: { navigation: any }) {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [translatedText, setTranslatedText] = useState<string>('Translated text will appear here');
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'TunSL' | 'ASL' | 'ARSL'>('TunSL');
  const videoRef = useRef<any>(null);

  useEffect(() => {
    // Reset placeholder when switching language
    setTranslatedText('Translated text will appear here');
    tflite.loadModel(
      {
        model: `models/${selectedLanguage}.tflite`,
        labels: `models/${selectedLanguage}_labels.txt`,
      },
      (err: any) => {
        if (err) console.error('TFLite load error:', err);
      }
    );
  }, [selectedLanguage]);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setVideoUri(result.assets[0].uri);
      setTranslatedText('Translated text will appear here');
    }
  };

  const onLoad = (status: AVPlaybackStatus) => {
    if ('durationMillis' in status && status.durationMillis) {
      setDurationMs(status.durationMillis);
    }
  };

  const handleTranslate = async () => {
    if (!videoUri || processing) return;
    setProcessing(true);
    const frameInterval = 500;
    let buffer: string[] = [];
    const sentence: string[] = [];

    for (let t = 0; t < durationMs; t += frameInterval) {
      try {
        const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: t });
        buffer.push(thumbUri);
        if (buffer.length === 10) {
          const preds = await Promise.all(
            buffer.map(path =>
              new Promise<any>((res, rej) => {
                tflite.runModelOnImage(
                  { path, imageMean: 0, imageStd: 255, numResults: 1, threshold: 0.1 },
                  (err: any, res_: any) => (err ? rej(err) : res(res_[0]))
                );
              })
            )
          );
          const label = preds
            .map((p: any) => p.label as string)
            .reduce((a: string, b: string) =>
              preds.filter((x: any) => x.label === a).length >= preds.filter((x: any) => x.label === b).length ? a : b
            );
          sentence.push(label);
          buffer = [];
        }
      } catch (e) {
        console.warn('Thumbnail error:', e);
      }
    }

    setTranslatedText(sentence.join(' '));
    setProcessing(false);
  };

  return (
    <LinearGradient colors={['#88C5A6', '#396F7A']} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Ionicons name="close" size={32} color="#003C47" />
      </TouchableOpacity>

      <View style={styles.headerBox}>
        <Text style={styles.header}>Video Translation</Text>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(value) => setSelectedLanguage(value as any)}
          style={styles.picker}
          dropdownIconColor="#003C47"
        >
          <Picker.Item label="Tunisian Sign Language (TunSL)" value="TunSL" />
          <Picker.Item label="American Sign Language (ASL)" value="ASL" />
          <Picker.Item label="Arabic Sign Language (ARSL)" value="ARSL" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.uploadBtn} onPress={pickVideo}>
        <Ionicons name="folder-open" size={24} color="#003C47" />
        <Text style={styles.uploadText}>Upload Video</Text>
      </TouchableOpacity>

      {videoUri && (
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.videoPlayer}
          onLoad={onLoad}
        />
      )}

      <TouchableOpacity
        style={[styles.translateBtn, processing && styles.disabled]}
        onPress={handleTranslate}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator color="#003C47" />
        ) : (
          <Text style={styles.translateText}>Translate</Text>
        )}
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.translatedText}>{translatedText}</Text>
      </View>

      <NavBar />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, alignItems: 'center' },
  closeButton: { position: 'absolute', top: 40, left: 20 },
  headerBox: { backgroundColor: '#B2E8D7', padding: 10, borderRadius: 20, marginBottom: 20 },
  header: { fontSize: 24, color: '#003C47', fontWeight: 'bold' },
  pickerContainer: { width: '80%', backgroundColor: '#B2E8D7', borderRadius: 20, marginBottom: 20, borderWidth: 2, borderColor: '#A2E9C5' },
  picker: { color: '#003C47', height: 50, width: '100%' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#B2E8D7', padding: 15, borderRadius: 20, marginBottom: 10, borderWidth: 2, borderColor: '#A2E9C5' },
  uploadText: { marginLeft: 10, color: '#003C47', fontWeight: 'bold' },
  videoPlayer: { width: '90%', height: 200, borderRadius: 15, marginBottom: 20 },
  translateBtn: { backgroundColor: '#396F7A', padding: 15, borderRadius: 20, marginBottom: 20 },
  disabled: { opacity: 0.6 },
  translateText: { color: '#fff', fontWeight: 'bold' },
  textContainer: { width: '90%', minHeight: 100, backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 2, borderColor: '#A2E9C5' },
  translatedText: { color: '#003C47', fontSize: 18, textAlign: 'center' },
});
