import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types'; // Adjust path if needed

type GetStartedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GetStarted'>;

export default function GetStartedScreen() {
  const navigation = useNavigation<GetStartedScreenNavigationProp>();

  const handleNext = () => {
    navigation.navigate('ModeSelection');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>
          Welcome to <Text style={styles.highlight}>Gestura</Text>
        </Text>

        <Text style={styles.content}>
          Break communication barriers with our real-time sign language translation!
          Gestura seamlessly converts between signs and speech/text, making conversations flow naturally in any situation.
        </Text>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
