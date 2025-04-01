import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

// Définition des types pour la navigation
type Props = NativeStackScreenProps<RootStackParamList, 'ChooseLanguage'>;

const ChooseLanguageScreen = () => {
    const navigation = useNavigation<Props['navigation']>();

    // Navigate to HomeScreen
    const goToHome = () => {
        navigation.navigate('Home');
    };

    // Navigate to SignToTextScreen with a specific language
    const goToSignToText = (language: string) => {
        navigation.navigate('SignToText', { language });
    };

    return (
        <LinearGradient colors={['#88C5A6','#88C5A6', '#396F7A']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Close button */}
            <TouchableOpacity onPress={goToHome} style={{ position: 'absolute', top: 40, left: 20 }}>
                <Ionicons name='close-circle' size={40} color='#003C47' />
            </TouchableOpacity>

            {/* Title */}
            <View style={{ marginBottom: 50 }}>
                <Text style={{ fontSize: 24, color: '#003C47', backgroundColor: '#A2E9C5', paddingVertical: 10, paddingHorizontal: 50, borderRadius: 20 }}>
                    Choose Sign Language
                </Text>
            </View>

            {/* Language buttons */}
            <TouchableOpacity onPress={() => goToSignToText('TunSL')} style={{ marginVertical: 10, width: '60%' }}>
                <LinearGradient colors={['#396F7A', '#88C5A6']} style={{ paddingVertical: 15, borderRadius: 30, alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 20 }}>TunSL</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToSignToText('ArSL')} style={{ marginVertical: 10, width: '60%' }}>
                <LinearGradient colors={['#396F7A', '#88C5A6']} style={{ paddingVertical: 15, borderRadius: 30, alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 20 }}>ArSL</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToSignToText('ASL')} style={{ marginVertical: 10, width: '60%' }}>
                <LinearGradient colors={['#396F7A', '#88C5A6']} style={{ paddingVertical: 15, borderRadius: 30, alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 20 }}>ASL</Text>
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default ChooseLanguageScreen;
