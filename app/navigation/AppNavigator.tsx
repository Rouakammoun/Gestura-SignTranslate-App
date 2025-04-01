// /app/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';  // Import screen types
import SetLanguageScreen from '../screens/SetLanguageScreen';
import ChooseLanguageScreen from '../screens/ChooseSLScreen';
import HomeScreen from '../screens/HomeScreen';
import TextOrSpeechToSignScreen from '../screens/TextOrSpeechToSLScreen';
import SignToTextScreen from '../screens/SignToTextScreen';


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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
