import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import your screens
import SetLanguageScreen from './app/screens/SetLanguageScreen';
import ChooseSLScreen from './app/screens/ChooseSLScreen';
import HomeScreen from './app/screens/HomeScreen';
import TextOrSpeechToSignScreen from './app/screens/TextOrSpeechToSLScreen';
import SignToTextScreen from './app/screens/SignToTextScreen';
import HomeScreen0 from './app/screens/HomeScreen0';
import SettingsScreen from './app/screens/SettingsScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import SignInScreen from './app/screens/SignInScreen';
import GetStartedScreen from './app/screens/GetStartedScreen';
import ModeSelectionScreen from './app/screens/ModeSelectionScreen';
import VideoTranslationScreen from './app/screens/VideoTranslationScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import WelcomeScreen from './app/screens/WelcomeScreen';
import LearnMoreScreen from './app/screens/LearnMoreScreen';
import FeedbackScreen from './app/screens/FeedbackScreen';
import { RootStackParamList } from "./app/navigation/types";

// Create a typed Stack navigator
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SetLanguage" component={SetLanguageScreen} />
          <Stack.Screen name="ChooseSL" component={ChooseSLScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="TextOrSpeechToSign" component={TextOrSpeechToSignScreen} />
          <Stack.Screen name="SignToText" component={SignToTextScreen} />
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Home0" component={HomeScreen0} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
          <Stack.Screen name="VideoTranslation" component={VideoTranslationScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="LearnMore" component={LearnMoreScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
