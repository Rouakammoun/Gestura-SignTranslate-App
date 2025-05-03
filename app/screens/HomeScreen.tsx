// import React from "react";
// import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
// import { StackNavigationProp } from "@react-navigation/stack"; // Import StackNavigationProp
// import { RootStackParamList } from "../navigation/types";
// import NavBar from "../components/NavBar";

// // Define the type for navigation props
// type HomeScreenNavigationProp = StackNavigationProp<
//   RootStackParamList, // RootStackParamList should be defined elsewhere, defining all the screen names in your navigation
//   "Home" // This is the current screen name
// >;

// const HomeScreen = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>(); // Initialize navigation object with types

//   // Function to navigate to the Sign to Text/Speech screen
//   const goToSignToText = () => {
//     navigation.navigate("ChooseLanguage"); // Replace with your actual screen name
//   };

//   // Function to navigate to the Text/Speech to Sign screen
//   const goToTextToSign = () => {
//     navigation.navigate("TextOrSpeechToSign"); // Replace with your actual screen name
//   };

//   // Function to navigate to the Video Translation screen
//   const goToVideoTranslation = () => {
//     navigation.navigate("VideoTranslation"); // Replace with your actual screen name
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <View style={styles.circleIconContainer}>
//             <Image
//               source={require("../assets/Hand_signs-removebg-preview.png")}
//               style={styles.handIcon}
//             />
//           </View>
//           <Text style={styles.title}>Home Page</Text>
//         </View>
//       </View>

//       {/* Gradient Background Container */}
//       <LinearGradient
//         colors={["#88C5A6", "#88C5A6"]}
//         style={styles.gradientContainer}
//       >
//         {/* Service Bar */}
//         <View style={styles.serviceBar}>
//           <Text style={styles.serviceText}>Three Main Services</Text>
//         </View>

//         {/* Buttons for navigation */}
//         <TouchableOpacity style={styles.button} onPress={goToSignToText}>
//           <View style={styles.circle} />
//           <Text style={styles.buttonText}>Sign to Text/Speech</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.button} onPress={goToTextToSign}>
//           <View style={styles.circle} />
//           <Text style={styles.buttonText}>Text/Speech to Sign</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.button} onPress={goToVideoTranslation}>
//           <View style={styles.circle} />
//           <Text style={styles.buttonText}>Video Translation</Text>
//         </TouchableOpacity>

//         {/* Navigation Bar */}
//         <NavBar />
//       </LinearGradient>
//     </View>
//   );
// };

// // Define styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   header: {
//     backgroundColor: "#FFFFFF",
//     height: "17.8%",
//     paddingHorizontal: 15,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   circleIconContainer: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 80,
//     borderWidth: 20,
//     borderColor: "#88C5A6",
//     padding: 20,
//     marginRight: -60,
//     marginLeft: 0,
//     marginTop: 30,
//     marginBottom: -20,
//     position: "absolute",
//     left: -180,
//     top: -50,
//     zIndex: 1,
//   },
//   handIcon: {
//     width: 75,
//     height: 75,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#3B3B3B",
//     right: -150,
//     top: 20,
//     position: "absolute",
//   },
//   gradientContainer: {
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   serviceBar: {
//     backgroundColor: "#00819E",
//     borderRadius: 20,
//     marginVertical: 10,
//     paddingVertical: 5,
//     paddingHorizontal: 20,
//     alignSelf: "flex-end",
//     marginRight: 20,
//     marginBottom: 20,
//   },
//   serviceText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   button: {
//     top: 70,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#00819E",
//     borderRadius: 30,
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     marginVertical: 20,
//     width: "90%",
//   },
//   circle: {
//     width: 30,
//     height: 30,
//     borderRadius: 30,
//     backgroundColor: "#FFFFFF",
//     marginRight: 15,
//   },
//   buttonText: {
//     color: "#FFFFFF",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
// });

// export default HomeScreen;

import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, I18nManager } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import NavBar from "../components/NavBar";
import { useLanguage } from "../contexts/LanguageContext";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t, isRTL } = useLanguage();

  const goToSignToText = () => navigation.navigate("ChooseLanguage");
  const goToTextToSign = () => navigation.navigate("TextOrSpeechToSign");
  const goToVideoTranslation = () => navigation.navigate("VideoTranslation");

  // RTL-aware styles
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    headerContent: {
      flexDirection: isRTL ? "row-reverse" : "row", // Keep row-reverse for RTL
      alignItems: "center",
    },
    circleIconContainer: {
      left: isRTL ? undefined : -180,
      right: isRTL ? -180 : undefined,
      marginLeft: isRTL ? -60 : 0,
      marginRight: isRTL ? 0 : -60,
      marginTop: 30,
      marginBottom: -20,
      position: "absolute",
      top: -50,
      zIndex: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#3B3B3B",
      top: 20,
      position: "absolute",
      right: isRTL ? -20 : undefined, // Adjust title position for RTL
      left: isRTL ? undefined : -15,
      textAlign: isRTL ? "right" : "left", // Text alignment for RTL
    },
    serviceBar: {
      backgroundColor: "#00819E",
      borderRadius: 20,
      marginVertical: isRTL ? 30 : 12,
      paddingVertical: 5,
      paddingHorizontal: 20,
      alignSelf: isRTL ? "flex-start" : "flex-end", // Align the service bar
    },
    button: {
      flexDirection: isRTL ? "row" : "row", // Adjust row direction for RTL
      alignItems: "center",
      backgroundColor: "#00819E",
      borderRadius: 30,
      paddingVertical: 30,
      paddingHorizontal: 20,
      marginVertical: 20,
      width: "90%",
    },
    circle: {
      width: 30,
      height: 30,
      borderRadius: 30,
      backgroundColor: "#FFFFFF",
      marginLeft: isRTL ? 10 : 0,
      marginRight: isRTL ? 15 : 15,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: isRTL ? "right" : "right", // Text alignment for buttons
    },
  });
  
  return (
    <View style={dynamicStyles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={dynamicStyles.headerContent}>
          <View style={[styles.circleIconContainer, dynamicStyles.circleIconContainer]}>
            <Image
              source={require("../assets/Hand_signs-removebg-preview.png")}
              style={styles.handIcon}
            />
          </View>
          <Text style={[styles.title, dynamicStyles.title]}>{t('home_title')}</Text>
        </View>
      </View>

      {/* Gradient Background Container */}
      <LinearGradient
        colors={["#88C5A6", "#88C5A6"]}
        style={styles.gradientContainer}
      >
        {/* Service Bar */}
        <View style={[styles.serviceBar, dynamicStyles.serviceBar]}>
          <Text style={styles.serviceText}>{t('services_title')}</Text>
        </View>

        {/* Buttons for navigation */}
        <TouchableOpacity 
          style={[styles.button, dynamicStyles.button]} 
          onPress={goToSignToText}
        >
          <View style={[styles.circle, dynamicStyles.circle]} />
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            {t('sign_to_text')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, dynamicStyles.button]} 
          onPress={goToTextToSign}
        >
          <View style={[styles.circle, dynamicStyles.circle]} />
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            {t('text_to_sign')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, dynamicStyles.button]} 
          onPress={goToVideoTranslation}
        >
          <View style={[styles.circle, dynamicStyles.circle]} />
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            {t('video_translation')}
          </Text>
        </TouchableOpacity>

        {/* Navigation Bar */}
        <NavBar />
      </LinearGradient>
    </View>
  );
};

// Static styles
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
    height: "17.8%",
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  circleIconContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 90, // Reduced the size of the border radius
    borderWidth: 10,  // Reduced border width
    borderColor: "#88C5A6",
    padding: 10, // Reduced the padding
    marginTop: 30,
    marginBottom: -20,
    position: "absolute",
    top: -50,
    zIndex: 1,
  },
  handIcon: {
    width: 100, // Reduced size of the icon
    height: 100, // Reduced size of the icon
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3B3B3B",
    top: 20,
    position: "absolute",
  },
  gradientContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  serviceBar: {
    backgroundColor: "#00819E",
    borderRadius: 20,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  serviceText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    top: 70,
    alignItems: "center",
    backgroundColor: "#00819E",
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginVertical: 20,
    width: "90%",
  },
  circle: {
    width: 40,  // Reduced size of the circle
    height: 40, // Reduced size of the circle
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HomeScreen;