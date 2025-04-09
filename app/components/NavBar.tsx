import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // Assuming you have your navigation types set up

// Define navigation prop type
type NavBarProps = NativeStackNavigationProp<RootStackParamList>;

const NavBar: React.FC = () => {
  const navigation = useNavigation<NavBarProps>(); // Hook to get the navigation prop

  // Handle navigation for Home and Profile screens
  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToFeedback = () => {
    navigation.navigate('Feedback');
  };

  return (
    <View style={styles.navbar}>
      {/* Home Button */}
      <TouchableOpacity style={styles.navButton} onPress={navigateToHome}>
        <Ionicons name="home-outline" size={30} color="#333" />
      </TouchableOpacity>
      
      {/* Profile Button */}
      <TouchableOpacity style={styles.navButton} onPress={navigateToProfile}>
        <Ionicons name="person-outline" size={30} color="#333" />
      </TouchableOpacity>
      
      {/* Feedback Button */}
      <TouchableOpacity style={styles.navButton} onPress={navigateToFeedback}>
        <Ionicons name="chatbubble-outline" size={30} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    elevation: 5,
  },
  navButton: {
    alignItems: 'center',
  },
});

export default NavBar;
