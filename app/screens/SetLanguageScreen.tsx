import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type SetLanguageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SetLanguage'>;

const languages = [
  { key: 'french', label: 'French Language' },
  { key: 'arabic', label: 'Arabic Language' },
  { key: 'english', label: 'English Language' },
];

const SetLanguageScreen = () => {
  const navigation = useNavigation<SetLanguageScreenNavigationProp>();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedLanguage) {
      navigation.navigate('Home');
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
              selectedLanguage === lang.key && styles.languageOptionSelected,
            ]}
            onPress={() => setSelectedLanguage(lang.key)}
          >
            <Text style={styles.languageText}>{lang.label}</Text>
            <View style={styles.circle}>
              {selectedLanguage === lang.key && <Text style={styles.tick}>✔</Text>}
            </View>
          </TouchableOpacity>
        ))}

        {/* Continue Button */}
        {selectedLanguage && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue</Text>
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
