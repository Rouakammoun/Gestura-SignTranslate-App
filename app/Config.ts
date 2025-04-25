// src/Config.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your computer's IPv4 address and Flask server port
const LOCAL_IP = '192.168.1.18'; // Change this to your actual IPv4 address
const PORT = '5000'; // Your Flask server port

// Define the URLs for different platforms (Android/iOS) during development
const DEVELOPMENT_URLS = {
  android: [
    `http://${LOCAL_IP}:${PORT}`, // For Android physical device
    'http://10.0.2.2:5000',       // Android emulator
  ],
  ios: [
    `http://${LOCAL_IP}:${PORT}`, // For iOS physical device
    'http://localhost:5000',      // iOS simulator
  ]
};

// The URL to use for production
const PRODUCTION_URL = 'https://your-production-api.com';

// Helper function for fetch with timeout to prevent hanging requests
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 2000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Function to get the appropriate API base URL based on platform and availability
export const getApiBaseUrl = async () => {
  // Directly return the IP address (for your setup, no need to dynamically select URLs)
  return `http://${LOCAL_IP}:${PORT}`; // Direct IP address and port
};

export default {
  getApiBaseUrl,
  fetchWithTimeout,
  timeout: 15000
};



// // src/Config.ts
// import { Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Replace with your computer's IPv4 address and Flask server port
// const LOCAL_IP = '192.168.100.7'; // Change this to your actual IPv4 address
// const PORT = '5000'; // Your Flask server port

// // Define the URLs for different platforms (Android/iOS) during development
// const DEVELOPMENT_URLS = {
//   android: [
//     `http://${LOCAL_IP}:${PORT}`, // For Android physical device
//     'http://10.0.2.2:5000',       // Android emulator
//   ],
//   ios: [
//     `http://${LOCAL_IP}:${PORT}`, // For iOS physical device
//     'http://localhost:5000',      // iOS simulator
//   ]
// };

// // The URL to use for production
// const PRODUCTION_URL = 'https://your-production-api.com';

// // Helper function for fetch with timeout to prevent hanging requests
// const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 2000) => {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), timeout);

//   try {
//     const response = await fetch(url, {
//       ...options,
//       signal: controller.signal
//     });
//     clearTimeout(timeoutId);
//     return response;
//   } catch (error) {
//     clearTimeout(timeoutId);
//     throw error;
//   }
// };

// // Function to get the appropriate API base URL based on platform and availability
// export const getApiBaseUrl = async () => {
//   // In production, return the production URL immediately
//   if (!__DEV__) return PRODUCTION_URL;

//   // Check for a cached URL (last working URL)
//   const cachedUrl = await AsyncStorage.getItem('last_working_url');
//   if (cachedUrl) {
//     try {
//       // Test the cached URL by pinging it
//       const response = await fetchWithTimeout(`${cachedUrl}/ping`);
//       if (response.ok) return cachedUrl; // If successful, return the cached URL
//     } catch (error) {
//       console.log(`Cached URL ${cachedUrl} failed, trying others`);
//     }
//   }

//   // Try all available URLs based on the platform (Android/iOS)
//   const urls = DEVELOPMENT_URLS[Platform.OS as keyof typeof DEVELOPMENT_URLS];

//   for (const url of urls) {
//     try {
//       // Test each URL by pinging it
//       const response = await fetchWithTimeout(`${url}/ping`);
//       if (response.ok) {
//         // If successful, cache the working URL and return it
//         await AsyncStorage.setItem('last_working_url', url);
//         return url;
//       }
//     } catch (error) {
//       console.log(`Failed to connect to ${url}`);
//     }
//   }

//   // If no URL works, throw an error
//   throw new Error('Could not connect to any backend server');
// };

// export default {
//   getApiBaseUrl,
//   fetchWithTimeout,
//   timeout: 15000
// };
