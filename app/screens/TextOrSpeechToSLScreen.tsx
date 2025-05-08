import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useVideoPlayer, VideoView } from "expo-video";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import NavBar from "../components/NavBar";
import { RootStackParamList } from "../navigation/types";
import { Animated, Easing } from "react-native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TextOrSpeechToSign">;

export default function TextOrSpeechToSignScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "fr" | "ar">("en");
  const [selectedSignLanguage, setSelectedSignLanguage] = useState<"ASL" | "FSL" | "ArSL" | "ISL">("ASL");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);

  const player = useVideoPlayer(
    { uri: videoUri || "" },
    (p) => {
      p.play();
      p.loop = true;
    }
  );

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (recording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1); // Reset when not recording
    }
  }, [recording]);

  const toggleLanguage = () => {
    const langs: ("en" | "fr" | "ar")[] = ["en", "fr", "ar"];
    setSelectedLanguage(langs[(langs.indexOf(selectedLanguage) + 1) % langs.length]);
  };

  const toggleSignLanguage = () => {
    const signs: ("ASL" | "FSL" | "ArSL" | "ISL")[] = ["ASL", "FSL", "ArSL", "ISL"];
    setSelectedSignLanguage(signs[(signs.indexOf(selectedSignLanguage) + 1) % signs.length]);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert("Input Error", "Please enter some text");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://192.168.100.21:5000/translate_to_sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          inputLanguage: selectedLanguage,
          targetSignLanguage: selectedSignLanguage,
        }),
      });

      if (!response.ok) throw new Error(await response.text());

      const { videoUrl } = await response.json();
      setVideoUri(videoUrl);
    } catch (error: any) {
      Alert.alert("Translation Error", error.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      if (recordingRef.current) {
        console.warn("Recording already in progress");
        return;
      }

      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Denied", "Cannot access microphone");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();

      recordingRef.current = recording;
      setRecording(true);
    } catch (error) {
      console.error("Start Recording Error:", error);
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      const previousRecording = recordingRef.current;
      recordingRef.current = null;
      setRecording(false);

      if (uri) {
        await uploadAudio(uri);
      }

      previousRecording && previousRecording.setOnRecordingStatusUpdate(null);
    } catch (error) {
      console.error("Stop Recording Error:", error);
      setRecording(false);
    }
  };

  const uploadAudio = async (uri: string) => {
    setLoading(true);
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error("Audio file not found");

      const formData = new FormData();
      formData.append("audio", {
        uri,
        name: "audio.wav",
        type: "audio/wav",
      } as any);

      formData.append("language", selectedLanguage);

      const response = await fetch("http://192.168.100.21:5000/whisper_transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      const { text } = await response.json();
      setInputText(text);
    } catch (error: any) {
      Alert.alert("Upload Error", error.message || "Failed to transcribe audio");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechToTextToggle = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const goHome = () => navigation.navigate("Home");

  return (
    <LinearGradient colors={["#9DC4BC", "#9DC4BC"]} style={{ flex: 1, alignItems: "center", paddingTop: 25 }}>
      <SafeAreaView style={{ width: "100%", padding: 10 }}>
        <TouchableOpacity onPress={goHome}>
          <Ionicons name="close-circle" size={40} color="#004E64" />
        </TouchableOpacity>
      </SafeAreaView>

      <View
        style={{
          width: "80%",
          height: "50%",
          backgroundColor: "#f4f4f4",
          borderRadius: 30,
          borderWidth: 5,
          borderColor: "#004E64",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          padding: 15,
          overflow: "hidden", // Ensures the video fits within the border radius
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#004E64" />
        ) : videoUri ? (
          <VideoView
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 30, // Same border radius as the container
            }}
            player={player}
            nativeControls={false}
          />
        ) : (
          <Text style={{ fontSize: 18, color: "#000" }}>
            Your Sign Language Video will appear here
          </Text>
        )}

        <TouchableOpacity
          onPress={toggleSignLanguage}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "#004E64",
            padding: 10,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="translate" size={18} color="#FFF" />
          <Text style={{ color: "#FFF", marginLeft: 6, fontSize: 14 }}>
            {selectedSignLanguage}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "85%",
          backgroundColor: "#f4f4f4",
          borderRadius: 25,
          borderWidth: 3,
          borderColor: "#004E64",
          padding: 15,
          alignItems: "center",
          marginVertical: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }}
      >
        <TextInput
          style={{ flex: 1, fontSize: 18, color: "#000", paddingLeft: 10 }}
          placeholder="Enter text"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={toggleLanguage} style={{ marginHorizontal: 10 }}>
          <FontAwesome5 name="language" size={24} color="#004E64" />
          <Text style={{ fontSize: 12, color: "#004E64", textAlign: "center" }}>{selectedLanguage.toUpperCase()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSpeechToTextToggle} disabled={loading}>
          {recording ? (
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#f4f4f4",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 3,
                borderColor: "#004E64",
              }}
            >
              <Ionicons name="mic" size={30} color="#fff" />
            </Animated.View>
          ) : (
            <Ionicons name="mic" size={30} color="#004E64" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleTranslate}
        style={{
          position: "absolute",
          bottom: 90,
          right: 35,
          width: 70,
          height: 70,
          backgroundColor: "#004E64",
          borderRadius: 35,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
        }}
      >
        <Ionicons name="arrow-forward-circle" size={40} color="#FFF" />
      </TouchableOpacity>

      <NavBar />
    </LinearGradient>
  );
}
