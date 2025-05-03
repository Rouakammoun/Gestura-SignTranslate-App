// import React from 'react';
// import { View, Text, StyleSheet, Image } from 'react-native';
// import { Button } from '../components/Button';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
// import { RootStackParamList } from '../navigation/types'; // Import RootStackParamList

// type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

// export default function WelcomeScreen() {
//   const navigation = useNavigation<WelcomeScreenNavigationProp>();

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../assets/gesturalogo.png')}
//         style={styles.logo}
//         resizeMode="contain"
//       />

//       <View style={styles.welcomeContainer}>
//         <Text style={styles.welcomeText}>welcome:)</Text>

//         {/* Get Started */}
//         <View style={styles.card}>
//           <Image
//             source={require('../assets/lightbulb.jpg')}
//             style={styles.icon}
//           />
//           <Button
//             title="Get Started!"
//             onPress={() => navigation.navigate('GetStarted')} // screen name in your navigator
//             style={styles.primaryButton}
//             textStyle={styles.buttonText}
//           />
//         </View>

//         {/* Learn More */}
//         <View style={styles.card}>
//           <Image
//             source={require('../assets/lightbulb.jpg')}
//             style={styles.icon}
//           />
//           <Button
//             title="Learn More!"
//             onPress={() => navigation.navigate('LearnMore')} // screen name in your navigator
//             style={styles.secondaryButton}
//             textStyle={styles.secondaryButtonText}
//           />
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#F5F5F5',
//   },
//   logo: {
//     width: 170,
//     height: 170,
//     marginBottom: 30,
//   },
//   welcomeContainer: {
//     backgroundColor: '#89C6A7',
//     padding: 25,
//     borderRadius: 25,
//     alignItems: 'center',
//     width: '100%',
//     paddingVertical: 70,
//     maxWidth: 400,
//   },
//   welcomeText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 20,
//     textTransform: 'lowercase',
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E3F2FD',
//     padding: 10,
//     borderRadius: 15,
//     width: '100%',
//     marginVertical: 15,
//   },
//   icon: {
//     width: 36,
//     height: 36,
//     marginRight: 10,
//   },
//   primaryButton: {
//     backgroundColor: '#25596E',
//     borderRadius: 10,
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     minWidth: 120,
//     maxWidth: 160,
//   },
//   secondaryButton: {
//     backgroundColor: 'white',
//     borderWidth: 2,
//     borderColor: '#25596E',
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     minWidth: 120,
//     maxWidth: 160,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 15,
//     fontWeight: 'bold',
//   },
//   secondaryButtonText: {
//     color: '#25596E',
//     fontSize: 15,
//     fontWeight: 'bold',
//   },
// });


import React from 'react';
import { View, Text, StyleSheet, Image, I18nManager } from 'react-native';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useLanguage } from '../contexts/LanguageContext';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { t, isRTL } = useLanguage();

  // RTL-aware styles
  const dynamicStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    card: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    icon: {
      marginRight: isRTL ? 0 : 10,
      marginLeft: isRTL ? 10 : 0,
    },
    welcomeText: {
      textAlign: isRTL ? 'right' : 'center',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    }
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Image
        source={require('../assets/gesturalogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeText, dynamicStyles.welcomeText]}>{t('welcome_message')}</Text>

        {/* Get Started */}
        <View style={[styles.card, dynamicStyles.card]}>
          <Image
            source={require('../assets/lightbulb.jpg')}
            style={[styles.icon, dynamicStyles.icon]}
          />
          <Button
            title={t('get_started')}
            onPress={() => navigation.navigate('GetStarted')}
            style={styles.primaryButton}
            textStyle={styles.buttonText}
          />
        </View>

        {/* Learn More */}
        <View style={[styles.card, dynamicStyles.card]}>
          <Image
            source={require('../assets/lightbulb.jpg')}
            style={[styles.icon, dynamicStyles.icon]}
          />
          <Button
            title={t('learn_more')}
            onPress={() => navigation.navigate('LearnMore')}
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 30,
  },
  welcomeContainer: {
    backgroundColor: '#89C6A7',
    padding: 25,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    paddingVertical: 70,
    maxWidth: 400,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textTransform: 'lowercase',
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 15,
    width: '100%',
    marginVertical: 15,
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 15,
  },
  primaryButton: {
    backgroundColor: '#25596E',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    minWidth: 120,
    maxWidth: 160,
    marginLeft: 20,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#25596E',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 120,
    maxWidth: 160,
    marginLeft: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#25596E',
    fontSize: 15,
    fontWeight: 'bold',
  },
});