import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseSL'>;

const ChooseSLScreen: React.FC<Props> = ({ navigation }) => {
  const goToHome = () => navigation.navigate('Home');

  const selectLanguage = (lang: string) => {
    navigation.navigate('SignToText', { language: lang });
  };

  return (
    <LinearGradient
      colors={['#88C5A6', '#88C5A6']}
      style={styles.container}
    >
      {/* Close Button */}
      <TouchableOpacity onPress={goToHome} style={styles.closeButton}>
        <Ionicons name="close-circle" size={40} color="#003C47" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Choose Sign Language</Text>

      {/* Language Buttons */}
      <View style={styles.buttonContainer}>
        {['TunSL', 'ArSL', 'ASL'].map((lang) => (
          <TouchableOpacity
            key={lang}
            onPress={() => selectLanguage(lang)}
            style={styles.languageButton}
          >
            <LinearGradient colors={['#396F7A', '#396F7A']} style={styles.languageButtonGradient}>
              <Text style={styles.languageButtonText}>{lang}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    color: '#003C47',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
    marginBottom: 50,
    overflow: 'hidden',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  languageButton: {
    marginVertical: 10,
    width: '60%',
  },
  languageButtonGradient: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});

export default ChooseSLScreen;
