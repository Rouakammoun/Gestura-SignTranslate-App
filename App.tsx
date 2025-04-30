import React from 'react';
import { SafeAreaView, StyleSheet, I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LanguageProvider, useLanguage } from './app/contexts/LanguageContext';

// Screen Imports
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

const Stack = createStackNavigator();

// Screen name constants for consistency
const SCREENS = {
  SET_LANGUAGE: 'SetLanguage',
  CHOOSE_LANGUAGE: 'ChooseLanguage',
  HOME: 'Home',
  TEXT_TO_SIGN: 'TextOrSpeechToSign',
  SIGN_TO_TEXT: 'SignToText',
  GET_STARTED: 'GetStarted',
  HOME_0: 'HomeScreen0',
  SETTINGS: 'Settings', // Changed from 'SettingsScreen' to 'Settings'
  SIGN_UP: 'SignUp',
  SIGN_IN: 'SignIn',
  MODE_SELECTION: 'ModeSelection',
  VIDEO_TRANSLATION: 'VideoTranslation',
  PROFILE: 'Profile',
  WELCOME: 'Welcome',
  LEARN_MORE: 'LearnMore',
  FEEDBACK: 'Feedback',
};

const AppContent = () => {
  const { isRTL } = useLanguage();

  return (
    <NavigationContainer>
      <SafeAreaView style={[
        styles.container, 
        isRTL ? styles.rtlContainer : styles.ltrContainer
      ]}>
        <Stack.Navigator
          initialRouteName={SCREENS.HOME_0}
          screenOptions={{
            gestureDirection: isRTL ? 'horizontal-inverted' : 'horizontal',
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [isRTL ? -layouts.screen.width : layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            }),
          }}
        >
          <Stack.Screen name={SCREENS.SET_LANGUAGE} component={SetLanguageScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.CHOOSE_LANGUAGE} component={ChooseLanguageScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.HOME} component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.TEXT_TO_SIGN} component={TextOrSpeechToSignScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.SIGN_TO_TEXT} component={SignToTextScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.GET_STARTED} component={GetStartedScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.HOME_0} component={HomeScreen0} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.SETTINGS} component={SettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.SIGN_UP} component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.SIGN_IN} component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.MODE_SELECTION} component={ModeSelectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.VIDEO_TRANSLATION} component={VideoTranslationScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.PROFILE} component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.WELCOME} component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.LEARN_MORE} component={LearnMoreScreen} options={{ headerShown: false }} />
          <Stack.Screen name={SCREENS.FEEDBACK} component={FeedbackScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const App = () => {
  const handleRTL = (isRTL: boolean) => {
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
    }
  };

  return (
    <LanguageProvider onLanguageChange={handleRTL}>
      <AppContent />
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ltrContainer: {
    direction: 'ltr',
  },
  rtlContainer: {
    direction: 'rtl',
  },
});

export { SCREENS };
export default App;