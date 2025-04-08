import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '@/hooks/useTheme'; // Assuming this is a custom hook for your theme

export default function RootLayout() {
  const { colors } = useTheme();  // Accessing the theme colors
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack screenOptions={{ headerShown: false }}>
        
        {/* Welcome Screen (Initial Screen) */}
        <Stack.Screen 
          name="index"  // Default page (Home)
          options={{
            animation: 'fade',
          }}
        />

        {/* Profile Screen */}
        <Stack.Screen 
          name="profile"  // `app/profile.tsx` will be used for this route
          options={{
            animation: 'slide_from_right',
          }}
        />
        
        {/* Settings Screen */}
        <Stack.Screen 
          name="settings"  // `app/settings.tsx`
          options={{
            animation: 'slide_from_right',
          }} 
        />
        
        {/* Choose Mode Screen */}
        <Stack.Screen 
          name="ChooseAMode"  // `app/ChooseAMode.tsx`
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        
        {/* Video Translation Screen */}
        <Stack.Screen 
          name="video_translation"  // `app/video_translation.tsx`
        />
        
        {/* Other screens can be added as needed */}
        
        {/* Tab Navigation (Optional) */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}
