import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useLanguage } from '../contexts/LanguageContext';

type GetStartedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GetStarted'>;

export default function GetStartedScreen() {
  const navigation = useNavigation<GetStartedScreenNavigationProp>();
  const { t, isRTL } = useLanguage();

  const handleNext = () => {
    navigation.navigate('ModeSelection');
  };

  // RTL-aware styles
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F9FC',
      padding: 25,
      justifyContent: 'center',
    },
    contentWrapper: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 30,
      shadowColor: '#25596E',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: isRTL ? 'right' : 'center',
      color: '#25596E',
      lineHeight: 32,
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    content: {
      fontSize: 16,
      marginBottom: 30,
      textAlign: isRTL ? 'right' : 'center',
      lineHeight: 24,
      color: '#555',
      paddingHorizontal: 10,
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    nextButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#00819e',
      paddingVertical: 16,
      borderRadius: 12,
      marginTop: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
      marginHorizontal: 8, // Changed from marginRight to work with RTL
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.contentWrapper}>
        <Text style={dynamicStyles.title}>
          {t('welcome_to')} <Text style={styles.highlight}>{t('app_name')}</Text>
        </Text>

        <Text style={dynamicStyles.content}>
          {t('get_started_description')}
        </Text>

        <TouchableOpacity style={dynamicStyles.nextButton} onPress={handleNext}>
          <Text style={dynamicStyles.buttonText}>{t('next')}</Text>
          <Ionicons 
            name={isRTL ? "arrow-back" : "arrow-forward"} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Static styles that don't need RTL adjustments
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
    padding: 25,
    justifyContent: 'center',
  },
  contentWrapper: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#25596E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#25596E',
    lineHeight: 32,
  },
  highlight: {
    color: '#00819e',
  },
  content: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
    color: '#555',
    paddingHorizontal: 10,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00819e',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
