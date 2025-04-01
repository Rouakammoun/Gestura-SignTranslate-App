import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NavBar from '../components/NavBar';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const SignToTextScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [translatedText, setTranslatedText] = useState('Translated text will appear here');
    const [cameraType] = useState<'back' | 'front'>('back');

    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            if (!permission?.granted) {
                await requestPermission();
            }
        })();
    }, [permission]);

    const goToHome = () => {
        navigation.navigate('Home'); // Ensures navigation to Home works correctly
    };

    async function translateText() {
        alert('Translating the text');
    }

    const speakText = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sound.mp3')
            );
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    if (!permission) {
        return <View />;
    }
    if (!permission.granted) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>We need your permission to use the camera</Text>
                <TouchableOpacity onPress={requestPermission} style={{ marginTop: 20 }}>
                    <Text>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#88C5A6', '#396F7A']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Close button to navigate home */}
            <TouchableOpacity onPress={goToHome} style={{ position: 'absolute', top: 40, left: 20 }}>
                <Ionicons name='close-circle' size={40} color='#003C47' />
            </TouchableOpacity>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 24, color: '#003C47', backgroundColor: '#B2E8D7', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 }}>
                    Sign To Text
                </Text>
            </View>

            <CameraView
                ref={cameraRef}
                style={{
                    width: '80%', height: '55%', borderRadius: 20, marginBottom: 20,
                    borderWidth: 4, borderColor: '#A2E9C5'
                }}
                facing={cameraType}
            />

            <View style={{
                width: '80%', height: '10%', backgroundColor: '#FFFFFF', borderRadius: 20,
                justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#A2E9C5'
            }}>
                <Text style={{ color: '#000000' }}>{translatedText}</Text>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <TouchableOpacity onPress={translateText} style={{ marginHorizontal: 20 }}>
                        <Ionicons name='language' size={30} color='#003C47' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={speakText} style={{ marginHorizontal: 20 }}>
                        <Ionicons name='volume-high' size={30} color='#003C47' />
                    </TouchableOpacity>
                </View>
            </View>

            <NavBar />
        </LinearGradient>
    );
};

export default SignToTextScreen;
