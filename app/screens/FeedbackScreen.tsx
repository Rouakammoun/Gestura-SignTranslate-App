import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import NavBar from '../components/NavBar';

const FeedbackScreen = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Simple validation for rating and comment
    if (rating === 0 || comment.trim() === '') {
      alert('Please provide a rating and a comment.');
      return;
    }

    setLoading(true); // Start loading
    console.log('Submitting Feedback...');
    console.log('Rating:', rating);
    console.log('Comment:', comment);

    // Simulate an API call with a delay of 2 seconds
    setTimeout(() => {
      setLoading(false); // End loading
      alert('Feedback submitted successfully!');
      setRating(0);
      setComment('');
    }, 2000);
  };

  const handleEmojiClick = (emoji, value) => {
    setRating(value);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>We Value Your Feedback!</Text>

        <View style={styles.feedbackCard}>
          <Text style={styles.subtitle}>Please rate your experience:</Text>

          {/* Emoji Rating System */}
          <View style={styles.emojiContainer}>
            {['😡', '😞', '😐', '😊', '😁'].map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEmojiClick(emoji, index + 1)} // Setting the rating value based on the emoji clicked
                style={[styles.emojiButton, rating === index + 1 && styles.selectedEmoji]}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
        </View>

        <View style={styles.feedbackCard}>
          <Text style={styles.subtitle}>Additional Comments:</Text>

          {/* Comment Text Input */}
          <TextInput
            style={styles.input}
            placeholder="Write your comments here"
            multiline
            value={comment}
            onChangeText={setComment}
            maxLength={300}
          />
        </View>

        {/* Submit Button or Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
        ) : (
          <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
            Submit Feedback
          </Button>
        )}

        {/* Navigation Bar */}
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginVertical: 60,
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
  },
  selectedEmoji: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
  },
  emoji: {
    fontSize: 40,
  },
  ratingText: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#333',
    marginTop: 10,
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
  feedbackCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#88C5A6',
    paddingVertical: 10,
    borderRadius: 8,
  },
  loader: {
    marginTop: 20,
  },
});

export default FeedbackScreen;
