import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screens
import SetLanguageScreen from './app/screens/SetLanguageScreen';
import ChooseLanguageScreen from './app/screens/ChooseSLScreen';
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

// Create a Stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* SafeAreaView ensures the app content is inside the safe area of the screen */}
      <SafeAreaView style={styles.container}>
        {/* Set up Stack Navigator to handle screen navigation */}
        <Stack.Navigator initialRouteName="HomeScreen0">
          {/* Define each screen and their corresponding component */}
          <Stack.Screen 
            name="SetLanguage" 
            component={SetLanguageScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="ChooseLanguage" 
            component={ChooseLanguageScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="TextOrSpeechToSign" 
            component={TextOrSpeechToSignScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="SignToText" 
            component={SignToTextScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="GetStarted" 
            component={GetStartedScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="HomeScreen0" 
            component={HomeScreen0} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="SettingsScreen" 
            component={SettingsScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="SignIn" 
            component={SignInScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="ModeSelection" 
            component={ModeSelectionScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="VideoTranslation" 
            component={VideoTranslationScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="LearnMore" 
            component={LearnMoreScreen} 
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen 
            name="Feedback" 
            component={FeedbackScreen} 
            options={{ headerShown: false }} // Hide header
          />


        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

// Styles for SafeAreaView
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;