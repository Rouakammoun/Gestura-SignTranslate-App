import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import NavBar from '../components/NavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import config from '../Config';
import { useLanguage } from '../contexts/LanguageContext';

const FeedbackScreen = () => {
  const { t, isRTL } = useLanguage();
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
        setApiBaseUrl(url);
        await axios.get(`${url}/auth/ping`, { timeout: 3000 });
        setNetworkError(false);
      } catch (err) {
        setNetworkError(true);
        setError(t('network_error'));
      }
    };
    initialize();
  }, []);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(t('rating_required'));
      return;
    }
    if (comment.trim() === '') {
      setError(t('comment_required'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) throw new Error(t('auth_required'));

      await axios.post(
        `${apiBaseUrl}/auth/submit-feedback`,
        { rating, comment },
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      Alert.alert(t('success'), t('feedback_thanks'), [
        { 
          text: 'OK', 
          onPress: () => {
            setRating(0);
            setComment('');
          }
        }
      ]);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: unknown) => {
    let errorMessage = t('submit_failed');
    
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        errorMessage = t('session_expired');
      } else if (err.response?.status === 404) {
        errorMessage = t('api_not_found');
      } else {
        errorMessage = err.response?.data?.error || errorMessage;
      }
      setNetworkError(true);
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    setError(errorMessage);
    Alert.alert(t('error'), errorMessage);
  };

  const handleEmojiClick = (value: number) => {
    setRating(value);
    setError('');
  };

  const emojiLabels = [
    t('very_bad'),
    t('bad'),
    t('neutral'),
    t('good'),
    t('excellent')
  ];

  const dynamicStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      paddingBottom: 80,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: '#333',
      textAlign: 'center',
      marginVertical: 20,
      writingDirection: isRTL ? 'rtl' : 'ltr'
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 12,
      color: '#555',
      fontWeight: '600',
      textAlign: isRTL ? 'right' : 'left'
    },
    input: {
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr'
    },
    charCounter: {
      textAlign: isRTL ? 'left' : 'right'
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={dynamicStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={dynamicStyles.title}>{t('feedback_title')}</Text>

        {networkError && (
          <View style={styles.networkWarning}>
            <Text style={styles.networkWarningText}>
              {t('network_warning')}
            </Text>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.feedbackCard}>
          <Text style={dynamicStyles.subtitle}>{t('rate_experience')}</Text>

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
                <Text style={styles.emojiLabel}>{emojiLabels[index]}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {rating > 0 && (
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedText}>
                {t('selected')}: {rating}/5
              </Text>
            </View>
          )}
        </View>

        <View style={styles.feedbackCard}>
          <Text style={dynamicStyles.subtitle}>{t('additional_comments')}</Text>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder={t('comments_placeholder')}
            placeholderTextColor="#888"
            multiline
            value={comment}
            onChangeText={setComment}
            maxLength={300}
            editable={!loading}
          />
          <Text style={[styles.charCounter, dynamicStyles.charCounter]}>
            {comment.length}/300 {t('characters')}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
        ) : (
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={networkError}
            loading={loading}
          >
            {t('submit_feedback')}
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
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',     // Center emojis vertically

  },
  emojiButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    opacity: 0.7,
  },
  selectedEmoji: {
    opacity: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    transform: [{ scale: 1.1 }],
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  emojiLabel: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  selectedContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignSelf: 'center',
  },
  selectedText: {
    color: '#2E7D32',
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
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  feedbackCard: {
    backgroundColor: '#fff',
    padding: 16,
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
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
  },
  loader: {
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: '#D32F2F',
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