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

// Create a Stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* SafeAreaView ensures the app content is inside the safe area of the screen */}
      <SafeAreaView style={styles.container}>
        {/* Set up Stack Navigator to handle screen navigation */}
        <Stack.Navigator initialRouteName="SetLanguage">
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
