// import React from 'react';
// import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { useLanguage } from '../contexts/LanguageContext';

// const LanguageSwitcher = () => {
//   const { t, locale, setLocale, isRTL } = useLanguage();

//   const languages = [
//     { code: 'en', name: 'English' },
//     { code: 'fr', name: 'Français' },
//     { code: 'ar', name: 'العربية' },
//   ];

//   return (
//     <View style={[styles.container, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
//       {languages.map((lang) => (
//         <TouchableOpacity
//           key={lang.code}
//           onPress={() => setLocale(lang.code)}
//           style={[
//             styles.button,
//             locale.startsWith(lang.code) && styles.activeButton
//           ]}
//         >
//           <Text style={styles.text}>{lang.name}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//     justifyContent: 'center',
//   },
//   button: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     marginHorizontal: 4,
//     borderRadius: 4,
//   },
//   activeButton: {
//     backgroundColor: '#2D5C74',
//   },
//   text: {
//     color: '#FFFFFF',
//   },
// });

// export default LanguageSwitcher;

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { t, locale, setLocale } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ];

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => setLocale(lang.code)}
          style={[styles.button, locale.startsWith(lang.code) && styles.activeButton]}
        >
          <Text style={styles.text}>{lang.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    justifyContent: 'center',
    flexDirection: 'row', // Keep the row direction constant
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: '#2D5C74',
  },
  text: {
    color: '#FFFFFF',
  },
});

export default LanguageSwitcher;
