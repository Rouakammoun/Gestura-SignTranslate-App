import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import NavBar from '../components/NavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import config from '../Config';

const FeedbackScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const url = await config.getApiBaseUrl();
        console.log('API Base URL set to:', url);
        setApiBaseUrl(url);
        
        // Verify connectivity
        await axios.get(`${url}/auth/ping`, { timeout: 3000 });
        setNetworkError(false);
      } catch (err) {
        console.error('Initialization error:', err);
        setNetworkError(true);
        setError('Cannot connect to server. Check your network and API URL.');
      }
    };
    initialize();
  }, []);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (comment.trim() === '') {
      setError('Please enter your comments');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('Authentication required. Please login again.');
      }

      const fullUrl = `${apiBaseUrl}/auth/submit-feedback`;
      console.log('Submitting to:', fullUrl);
      console.log('Using token:', userToken.slice(0, 10) + '...');

      const response = await axios.post(
        fullUrl,
        { rating, comment },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('Response:', response.data);
      Alert.alert('Success', 'Thank you for your feedback!', [
        { 
          text: 'OK', 
          onPress: () => {
            setRating(0);
            setComment('');
          }
        }
      ]);
    } catch (err) {
      let errorMessage = 'Failed to submit feedback';
      
      if (axios.isAxiosError(err)) {
        // Handle Axios errors
        console.error('Axios error:', {
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        });
        
        if (err.response?.status === 401) {
          errorMessage = 'Session expired. Please login again.';
        } else if (err.response?.status === 404) {
          errorMessage = 'API endpoint not found. Check server URL.';
        } else {
          errorMessage = err.response?.data?.error || errorMessage;
        }
        setNetworkError(true);
      } else if (err instanceof Error) {
        // Handle native Errors
        console.error('Generic error:', err.message);
        errorMessage = err.message;
      }

      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiClick = (value: number) => {
    setRating(value);
    setError('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>We Value Your Feedback!</Text>

        {networkError && (
          <View style={styles.networkWarning}>
            <Text style={styles.networkWarningText}>
              Network connection issue detected
            </Text>
          </View>
        )}

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <View style={styles.feedbackCard}>
          <Text style={styles.subtitle}>Please rate your experience:</Text>

          <View style={styles.emojiContainer}>
            {['😡', '😞', '😐', '😊', '😁'].map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEmojiClick(index + 1)}
                style={[
                  styles.emojiButton, 
                  rating === index + 1 && styles.selectedEmoji
                ]}
                disabled={loading}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingText}>
              Selected: {rating} {rating === 1 ? 'star' : 'stars'}
            </Text>
          )}
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.subtitle}>Additional Comments:</Text>
          <TextInput
            style={styles.input}
            placeholder="Write your comments here..."
            placeholderTextColor="#888"
            multiline
            value={comment}
            onChangeText={(text) => {
              setComment(text);
              setError('');
            }}
            maxLength={300}
            editable={!loading}
          />
          <Text style={styles.charCounter}>
            {comment.length}/300 characters
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator 
            size="large" 
            color="#4CAF50" 
            style={styles.loader} 
          />
        ) : (
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            labelStyle={styles.submitButtonLabel}
            disabled={networkError}
          >
            Submit Feedback
          </Button>
        )}

        <NavBar />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginVertical: 30,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 8,
    color: '#555',
    fontWeight: '600',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  emojiButton: {
    padding: 10,
    marginHorizontal: 3,
    opacity: 0.7,
  },
  selectedEmoji: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    transform: [{ scale: 1.1 }],
  },
  emoji: {
    fontSize: 30,
  },
  ratingText: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    height: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  charCounter: {
    alignSelf: 'flex-end',
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  feedbackCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#88C5A6',
    borderRadius: 8,
  },
  submitButtonContent: {
    height: 50,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  networkWarning: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
  },
  networkWarningText: {
    color: '#E65100',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default FeedbackScreen;