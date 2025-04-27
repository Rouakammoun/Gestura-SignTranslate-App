import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import NavBar from "../components/NavBar";
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av"; // Fix import

type TextOrSpeechToSignScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "TextOrSpeechToSign"
>;

const TextOrSpeechToSignScreen = () => {
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const navigation = useNavigation<TextOrSpeechToSignScreenNavigationProp>();

  const toggleLanguage = () => {
    const languages = ["en", "fr", "ar"];
    const nextIndex =
      (languages.indexOf(selectedLanguage) + 1) % languages.length;
    setSelectedLanguage(languages[nextIndex]);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text');
      return;
    }
  
    console.log("Sending text:", inputText); // Verify input text
  
    setLoading(true);
    try {
      const body = JSON.stringify({
        text: inputText,  // Ensure the text is passed correctly here
        language: selectedLanguage,
      });
      console.log("Request body:", body); // Log the body to check if text is included
  
      const response = await fetch(
        "https://us-central1-sign-mt.cloudfunctions.net/spoken_text_to_signed_video",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,  // Ensure the correct body is sent
        }
      );
      // Handle the response
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Received response:", data);
  
      setVideoUri(data.videoUrl); // Set the video URI
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Translation error:', error.message);
        alert('Translation failed: ' + error.message);
      } else {
        console.error('Unexpected error:', error);
        alert('Unexpected error occurred');
      }
    } finally {
      setLoading(false); // Hide loader once the API call is done
    }
  };
  

  const handleSpeechToSign = () => {
    Alert.alert("Speech to Sign activated");
  };

  const handleClose = () => {
    navigation.navigate("Home");
  };

  return (
    <LinearGradient
      colors={["#88C5A6", "#396F7A"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <SafeAreaView
        style={{
          width: "100%",
          alignItems: "flex-start",
          paddingTop: 3,
          paddingLeft: 10,
        }}
      >
        <TouchableOpacity onPress={handleClose}>
          <Ionicons name="close-circle" size={40} color="#003C47" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 24,
            color: "#003C47",
            backgroundColor: "#B2E8D7",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20,
          }}
        >
          Text/Speech to Sign
        </Text>
      </View>

      <View
        style={{
          width: "75%",
          height: "45%",
          backgroundColor: "#FFFFFF",
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          borderWidth: 4,
          borderColor: "#A2E9C5",
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#003C47" />
        ) : videoUri ? (
          <Video
            source={{ uri: videoUri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.CONTAIN} // Correct ResizeMode
            shouldPlay
            useNativeControls
            style={{ width: "100%", height: "100%", borderRadius: 30 }}
          />
        ) : (
          <Text style={{ fontSize: 18, color: "#000" }}>
            Animated Avatar Placeholder
          </Text>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "80%",
          height: "8%",
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          paddingHorizontal: 15,
          alignItems: "center",
          borderWidth: 3,
          borderColor: "#A2E9C5",
          marginBottom: 20,
        }}
      >
        <TextInput
          style={{ flex: 1, fontSize: 18, color: "#000" }}
          placeholder="Insert Text"
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          onPress={toggleLanguage}
          style={{ marginHorizontal: 10 }}
        >
          <FontAwesome5 name="language" size={28} color="#003C47" />
          <Text style={{ fontSize: 12, color: "#003C47", textAlign: "center" }}>
            {selectedLanguage.toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSpeechToSign}
          style={{ marginHorizontal: 10 }}
        >
          <Ionicons name="mic" size={28} color="#003C47" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleTranslate}
        style={{
          backgroundColor: "#003C47",
          paddingVertical: 10,
          paddingHorizontal: 40,
          borderRadius: 20,
          marginBottom: 30,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "bold" }}>
          Translate to Avatar
        </Text>
      </TouchableOpacity>

      <NavBar />
    </LinearGradient>
  );
};

export default TextOrSpeechToSignScreen;
