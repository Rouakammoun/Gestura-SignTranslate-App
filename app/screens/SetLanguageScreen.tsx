import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types'; // Ensure this is the correct path to your types

type SetLanguageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SetLanguage'>;

const SetLanguageScreen = () => {
  const navigation = useNavigation<SetLanguageScreenNavigationProp>();

  const [languages, setLanguages] = useState({
    french: false,
    arabic: false,
    english: false,
  });

  // Function to handle language selection and navigate to the Home screen
  const selectLanguage = (lang: keyof typeof languages) => {
    setLanguages((prevState) => ({
      ...prevState,
      [lang]: true,
    }));

    // Navigate to Home screen after selecting the language
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Circle Icon */}
      <View style={styles.circleIconContainer}>
        <Image
          source={require('../assets/Hand_signs-removebg-preview.png')}
          style={styles.circleImage}
        />
      </View>

      {/* Main Content */}
      <View style={styles.card}>
        <Text style={styles.title}>Choose Language</Text>

        {/* Language Selection Buttons */}
        {['french', 'arabic', 'english'].map((lang) => (
          <TouchableOpacity
            key={lang}
            style={styles.languageOption}
            onPress={() => selectLanguage(lang as keyof typeof languages)}
          >
            <Text style={styles.languageText}>{lang.charAt(0).toUpperCase() + lang.slice(1)} Language</Text>
            <View style={styles.circle} />
          </TouchableOpacity>
        ))}
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
  card: {
    backgroundColor: '#2D5C74',
    padding: 20,
    borderRadius: 30,
    width: '80%',
    height: '50%',
  },
  title: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3B7D97',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  languageText: {
    color: 'white',
    fontSize: 20,
  },
  bottomImage: {
    width: '110%',
    height: 200,
    resizeMode: 'contain',
  },
  circleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    marginRight: 15,
  },
});

export default SetLanguageScreen;
