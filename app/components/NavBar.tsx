// import React from 'react';
// import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../navigation/types';

// // Define the exact icon names we'll use
// type ValidIconName = 'home-outline' | 'person-outline' | 'chatbubble-outline';

// type NavBarProps = NativeStackNavigationProp<RootStackParamList>;

// const NavBar: React.FC = () => {
//   const navigation = useNavigation<NavBarProps>();

//   // Navigation handlers
//   const navigateToHome = () => navigation.navigate('Home');
//   const navigateToProfile = () => navigation.navigate('Profile');
//   const navigateToFeedback = () => navigation.navigate('Feedback');

//   // Nav items configuration with typed icon names
//   const navItems: {
//     name: string;
//     icon: ValidIconName;
//     action: () => void;
//   }[] = [
//     {
//       name: 'home',
//       icon: 'home-outline',
//       action: navigateToHome,
//     },
//     {
//       name: 'profile',
//       icon: 'person-outline',
//       action: navigateToProfile,
//     },
//     {
//       name: 'feedback',
//       icon: 'chatbubble-outline',
//       action: navigateToFeedback,
//     },
//   ];

//   return (
//     <View style={styles.navbar}>
//       {navItems.map((item) => (
//         <TouchableOpacity
//           key={item.name}
//           style={styles.navButton}
//           onPress={item.action}
//         >
//           <Ionicons name={item.icon} size={30} color="#333" />
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   navbar: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//     elevation: 5,
//   },
//   navButton: {
//     alignItems: 'center',
//   },
// });

// export default NavBar;

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure this is correctly imported
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useLanguage } from '../contexts/LanguageContext';  // Importing context to access RTL setting

type NavBarProps = NativeStackNavigationProp<RootStackParamList>;

const NavBar: React.FC = () => {
  const navigation = useNavigation<NavBarProps>();
  const { isRTL } = useLanguage(); // Get RTL setting from the context

  // Navigation handlers
  const navigateToHome = () => navigation.navigate('Home');
  const navigateToProfile = () => navigation.navigate('Profile');
  const navigateToFeedback = () => navigation.navigate('Feedback');

  // Nav items configuration with proper Ionicons types
  const navItems: {
    name: string;
    icon: keyof typeof Ionicons.glyphMap;  // Ensure valid icon names from Ionicons
    action: () => void;
  }[] = [
    {
      name: 'home',
      icon: 'home-outline',  // TypeScript now knows this is a valid Ionicon name
      action: navigateToHome,
    },
    {
      name: 'profile',
      icon: 'person-outline',
      action: navigateToProfile,
    },
    {
      name: 'feedback',
      icon: 'chatbubble-outline',
      action: navigateToFeedback,
    },
  ];

  return (
    <View
      style={[
        styles.navbar,
        {
          flexDirection: 'row', // Always use row layout regardless of RTL
        },
      ]}
    >
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.navButton}
          onPress={item.action}
        >
          <Ionicons name={item.icon} size={30} color="#333" />
        </TouchableOpacity>
      ))}
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
    justifyContent: 'space-around',
    paddingVertical: 10,
    elevation: 5,
  },
  navButton: {
    alignItems: 'center',
  },
});

export default NavBar;


