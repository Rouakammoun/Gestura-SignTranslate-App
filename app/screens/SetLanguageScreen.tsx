import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../Config';

type SetLanguageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SetLanguage'>;

const languages = [
  { key: 'french', label: 'French Language', value: 'French' },
  { key: 'arabic', label: 'Arabic Language', value: 'Arabic' },
  { key: 'english', label: 'English Language', value: 'English' },
];

const SetLanguageScreen = () => {
  const navigation = useNavigation<SetLanguageScreenNavigationProp>();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const url = await config.getApiBaseUrl();
      setApiBaseUrl(url);
    };
    initialize();
  }, []);

  const handleLanguageSelection = async () => {
    if (!selectedLanguage) return;
    
    setIsLoading(true);
    try {
      // 1. Get current user data
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User not authenticated');
      }

      // 2. Update language in backend database
      const response = await axios.put(
        `${apiBaseUrl}/auth/update-profile`,
        { language: selectedLanguage },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // 3. Update local storage
      const userData = JSON.parse(await AsyncStorage.getItem('userData') || '{}');
      const updatedUser = {
        ...userData,
        language: selectedLanguage
      };
      
      await AsyncStorage.multiSet([
        ['userData', JSON.stringify(updatedUser)],
        ['userLanguage', selectedLanguage],
        ['onboardingComplete', 'true']
      ]);

      // 4. Navigate to Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }]
      });
      
    } catch (error) {
      console.error('Language update error:', error);
      Alert.alert('Error', 'Failed to save language preference');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Icon */}
      <View style={styles.circleIconContainer}>
        <Image
          source={require('../assets/Hand_signs-removebg-preview.png')}
          style={styles.circleImage}
        />
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Choose Language</Text>

        {/* Language Options */}
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.key}
            style={[
              styles.languageOption,
              selectedLanguage === lang.value && styles.languageOptionSelected, // Changed from lang.key to lang.value
            ]}
            onPress={() => setSelectedLanguage(lang.value)} // Changed from lang.key to lang.value
          >
            <Text style={styles.languageText}>{lang.label}</Text>
            <View style={styles.circle}>
              {selectedLanguage === lang.value && <Text style={styles.tick}>✔</Text>} {/* Changed from lang.key to lang.value */}
            </View>
          </TouchableOpacity>
        ))}

        {/* Continue Button */}
        {selectedLanguage && (
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={handleLanguageSelection} // Changed from handleContinue to handleLanguageSelection
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.continueText}>Continue</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Image */}
      <Image source={require('../assets/two.jpg')} style={styles.bottomImage} />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleIconContainer: {
    backgroundColor: '#7FBF9D',
    borderRadius: 50,
    width: 80,
    height: 80,
    marginTop: 20,
    marginLeft: -250,
    top: 30,
    left: 20,
  },
  circleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  card: {
    backgroundColor: '#2D5C74',
    padding: 20,
    borderRadius: 30,
    width: '80%',
    height: '60%',
    justifyContent: 'center',
    marginTop: 40,
  },
  title: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 30,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3B7D97',
    padding: 15,
    borderRadius: 10,
    marginVertical: 12,
  },
  languageOptionSelected: {
    backgroundColor: '#569EB3',
  },
  languageText: {
    color: 'white',
    fontSize: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: {
    fontSize: 20,
    color: '#2D5C74',
  },
  continueButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#7FBF9D',
  },
  continueText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomImage: {
    width: '110%',
    height: 200,
    resizeMode: 'contain',
  },
});

export default SetLanguageScreen;
