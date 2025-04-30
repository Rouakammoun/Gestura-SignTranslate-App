// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../navigation/types';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import { MaterialIcons } from '@expo/vector-icons';
// import NavBar from '../components/NavBar';
// import config from '../Config';

// const ProfileScreen = () => {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Profile'>>();
//   const [userData, setUserData] = useState({
//     name: '',
//     profileImage: null as string | null,
//   });
//   const [refreshKey, setRefreshKey] = useState(0);

//   const loadUserData = async () => {
//     try {
//       const savedData = await AsyncStorage.getItem('userData');
//       if (savedData) {
//         const parsedData = JSON.parse(savedData);
//         setUserData({
//           name: parsedData.name,
//           profileImage: parsedData.profileImage || null,
//         });
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to load profile data');
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       loadUserData();
//       setRefreshKey(prev => prev + 1);
//     });

//     loadUserData();

//     return unsubscribe;
//   }, [navigation, refreshKey]);

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           onPress: async () => {
//             try {
//               await AsyncStorage.multiRemove(['userToken', 'userData']);
//               navigation.replace('SignIn');
//             } catch (error) {
//               Alert.alert('Error', 'Failed to logout');
//             }
//           },
//           style: 'destructive',
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   const handleImageAction = async (useCamera: boolean) => {
//     const { status } = useCamera 
//       ? await ImagePicker.requestCameraPermissionsAsync()
//       : await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (status !== 'granted') {
//       Alert.alert('Permission required', `Please allow access to ${useCamera ? 'camera' : 'photos'}`);
//       return;
//     }

//     try {
//       const result = await (useCamera 
//         ? ImagePicker.launchCameraAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 0.8,
//           })
//         : ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 0.8,
//           }));

//       if (!result.canceled && result.assets?.[0]?.uri) {
//         const newData = {
//           ...userData,
//           profileImage: result.assets[0].uri
//         };
//         setUserData(newData);
//         await AsyncStorage.setItem('userData', JSON.stringify(newData));
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update avatar');
//     }
//   };

//   const showImagePickerOptions = () => {
//     Alert.alert(
//       'Update Profile Picture',
//       'Choose an option',
//       [
//         { text: 'Take Photo', onPress: () => handleImageAction(true) },
//         { text: 'Choose from Gallery', onPress: () => handleImageAction(false) },
//         { text: 'Cancel', style: 'cancel' },
//       ],
//       { cancelable: true }
//     );
//   };

//   const getFirstName = (fullName: string) => {
//     const nameParts = fullName.split(' ');
//     return nameParts[0] || 'Your Name';
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.profileHeader}>
//         <TouchableOpacity onPress={showImagePickerOptions}>
//           <View style={styles.avatarContainer}>
//             <Image
//               source={userData.profileImage 
//                 ? { uri: userData.profileImage } 
//                 : require('../assets/default-profile.jpg')}
//               style={styles.profileImage}
//             />
//             <View style={styles.cameraBadge}>
//               <MaterialIcons name="camera-alt" size={20} color="#fff" />
//             </View>
//           </View>
//         </TouchableOpacity>
//         <Text style={styles.name}>{getFirstName(userData.name)}</Text>
//       </View>

//       <View style={styles.actionsContainer}>
//         <TouchableOpacity
//           style={[styles.actionButton, styles.editButton]}
//           onPress={() => navigation.navigate('Settings')}
//         >
//           <Text style={styles.actionButtonText}>Edit Profile</Text>
//           <MaterialIcons name="edit" size={20} color="#00819E" />
//         </TouchableOpacity>

//         <View style={styles.centeredButtonContainer}>
//           <TouchableOpacity
//             style={[styles.actionButton, styles.avatarButton]}
//             onPress={showImagePickerOptions}
//           >
//             <Text style={[styles.actionButtonText, styles.avatarButtonText]}>My Avatar</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.centeredButtonContainer}>
//           <TouchableOpacity
//             style={[styles.actionButton, styles.logoutButton]}
//             onPress={handleLogout}
//           >
//             <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
//             <MaterialIcons name="logout" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <NavBar />
//     </View>
//   );
// };

// // ... (keep your existing styles)

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F9FC',
//   },
//   profileHeader: {
//     alignItems: 'center',
//     paddingTop: 50,
//     paddingBottom: 10,
//     backgroundColor: '#F5F9FC',
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     borderWidth: 4,
//     marginTop: 40,
//     borderColor: '#00819E',
//   },
//   cameraBadge: {
//     position: 'absolute',
//     right: 10,
//     bottom: 10,
//     backgroundColor: '#00819E',
//     borderRadius: 20,
//     padding: 8,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   name: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#00819E',
//   },
//   actionsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 30,
//   },
//   centeredButtonContainer: {
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 25,
//     borderRadius: 12,
//   },
//   editButton: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#87C4A5',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   avatarButton: {
//     backgroundColor: '#87C4A5',
//     width: 200,
//     justifyContent: 'center',
//   },
//   logoutButton: {
//     backgroundColor: '#87C4A5',
//     width: 200,
//     justifyContent: 'center',
//   },
//   actionButtonText: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   avatarButtonText: {
//     color: '#fff',
//   },
//   logoutButtonText: {
//     color: '#fff',
//   },
// });

// export default ProfileScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import config from '../Config';
import { useLanguage } from '../contexts/LanguageContext';

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Profile'>>();
  const { t, isRTL } = useLanguage();
  const [userData, setUserData] = useState({
    name: '',
    profileImage: null as string | null,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const loadUserData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('userData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setUserData({
          name: parsedData.name,
          profileImage: parsedData.profileImage || null,
        });
      }
    } catch (error) {
      Alert.alert(t('error'), t('load_profile_error'));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUserData();
      setRefreshKey(prev => prev + 1);
    });

    loadUserData();

    return unsubscribe;
  }, [navigation, refreshKey]);

  const handleLogout = async () => {
    Alert.alert(
      t('logout'),
      t('logout_confirmation'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('logout'),
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userToken', 'userData']);
              navigation.replace('SignIn');
            } catch (error) {
              Alert.alert(t('error'), t('logout_error'));
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleImageAction = async (useCamera: boolean) => {
    const { status } = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        t('permission_required'), 
        t('allow_access', { feature: useCamera ? t('camera') : t('photos') })
      );
      return;
    }

    try {
      const result = await (useCamera 
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          }));

      if (!result.canceled && result.assets?.[0]?.uri) {
        const newData = {
          ...userData,
          profileImage: result.assets[0].uri
        };
        setUserData(newData);
        await AsyncStorage.setItem('userData', JSON.stringify(newData));
      }
    } catch (error) {
      Alert.alert(t('error'), t('update_avatar_error'));
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      t('update_profile_picture'),
      t('choose_option'),
      [
        { text: t('take_photo'), onPress: () => handleImageAction(true) },
        { text: t('choose_from_gallery'), onPress: () => handleImageAction(false) },
        { text: t('cancel'), style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const getFirstName = (fullName: string) => {
    if (!fullName) return t('your_name');
    const nameParts = fullName.split(' ');
    return nameParts[0];
  };

  // RTL-aware styles
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F9FC',
    },
    profileHeader: {
      alignItems: 'center',
    },
    actionButton: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    actionButtonText: {
      textAlign: isRTL ? 'right' : 'left',
      marginLeft: isRTL ? 0 : 10,
      marginRight: isRTL ? 10 : 0,
    },
    cameraBadge: {
      right: isRTL ? undefined : 10,
      left: isRTL ? 10 : undefined,
    }
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={[styles.profileHeader, dynamicStyles.profileHeader]}>
        <TouchableOpacity onPress={showImagePickerOptions}>
          <View style={styles.avatarContainer}>
            <Image
              source={userData.profileImage 
                ? { uri: userData.profileImage } 
                : require('../assets/default-profile.jpg')}
              style={styles.profileImage}
            />
            <View style={[styles.cameraBadge, dynamicStyles.cameraBadge]}>
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{getFirstName(userData.name)}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, dynamicStyles.actionButton]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.actionButtonText, dynamicStyles.actionButtonText]}>
            {t('edit_profile')}
          </Text>
          <MaterialIcons name="edit" size={20} color="#00819E" />
        </TouchableOpacity>

        <View style={styles.centeredButtonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.avatarButton, dynamicStyles.actionButton]}
            onPress={showImagePickerOptions}
          >
            <Text style={[styles.actionButtonText, styles.avatarButtonText, dynamicStyles.actionButtonText]}>
              {t('my_avatar')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centeredButtonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton, dynamicStyles.actionButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.actionButtonText, styles.logoutButtonText, dynamicStyles.actionButtonText]}>
              {t('logout')}
            </Text>
            <MaterialIcons name="logout" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#F5F9FC',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    marginTop: 40,
    borderColor: '#00819E',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#00819E',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00819E',
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  centeredButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  editButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#87C4A5',
    justifyContent: 'center',
    marginTop: 10,
  },
  avatarButton: {
    backgroundColor: '#87C4A5',
    width: 200,
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#87C4A5',
    width: 200,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  avatarButtonText: {
    color: '#fff',
  },
  logoutButtonText: {
    color: '#fff',
  },
});

export default ProfileScreen;