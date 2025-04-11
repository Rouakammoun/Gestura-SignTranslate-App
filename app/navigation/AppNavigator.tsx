// /app/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types'; // Import screen types
import SetLanguageScreen from '../screens/SetLanguageScreen';
import ChooseLanguageScreen from '../screens/ChooseSLScreen';
import HomeScreen from '../screens/HomeScreen';
import TextOrSpeechToSignScreen from '../screens/TextOrSpeechToSLScreen';
import SignToTextScreen from '../screens/SignToTextScreen';
import VideoTranslationScreen from '../screens/VideoTranslationScreen';
import ModeSelectionScreen from '../screens/ModeSelectionScreen';
import HomeScreen0 from '../screens/HomeScreen0';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import GetStartedScreen from '../screens/GetStartedScreen';
import LearnMoreScreen from '../screens/LearnMoreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FeedbackScreen from '../screens/FeedbackScreen';

// Create a stack navigator with defined types
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SetLanguage">
        <Stack.Screen name="SetLanguage" component={SetLanguageScreen} />
        <Stack.Screen name="ChooseLanguage" component={ChooseLanguageScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TextOrSpeechToSign" component={TextOrSpeechToSignScreen} />
        <Stack.Screen name="SignToText" component={SignToTextScreen} />
        <Stack.Screen name="VideoTranslation" component={VideoTranslationScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home0" component={HomeScreen0} />
        <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="LearnMore" component={LearnMoreScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
