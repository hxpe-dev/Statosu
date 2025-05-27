import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Montserrat_100Thin } from '@expo-google-fonts/montserrat/100Thin';
import { Montserrat_100Thin_Italic } from '@expo-google-fonts/montserrat/100Thin_Italic';
import { Montserrat_200ExtraLight } from '@expo-google-fonts/montserrat/200ExtraLight';
import { Montserrat_200ExtraLight_Italic } from '@expo-google-fonts/montserrat/200ExtraLight_Italic';
import { Montserrat_300Light } from '@expo-google-fonts/montserrat/300Light';
import { Montserrat_300Light_Italic } from '@expo-google-fonts/montserrat/300Light_Italic';
import { Montserrat_400Regular } from '@expo-google-fonts/montserrat/400Regular';
import { Montserrat_400Regular_Italic } from '@expo-google-fonts/montserrat/400Regular_Italic';
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat/500Medium';
import { Montserrat_500Medium_Italic } from '@expo-google-fonts/montserrat/500Medium_Italic';
import { Montserrat_600SemiBold } from '@expo-google-fonts/montserrat/600SemiBold';
import { Montserrat_600SemiBold_Italic } from '@expo-google-fonts/montserrat/600SemiBold_Italic';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat/700Bold';
import { Montserrat_700Bold_Italic } from '@expo-google-fonts/montserrat/700Bold_Italic';
import { Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat/800ExtraBold';
import { Montserrat_800ExtraBold_Italic } from '@expo-google-fonts/montserrat/800ExtraBold_Italic';
import { Montserrat_900Black } from '@expo-google-fonts/montserrat/900Black';
import { Montserrat_900Black_Italic } from '@expo-google-fonts/montserrat/900Black_Italic';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentUser } from '../api/osu';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Montserrat_100Thin, 
    Montserrat_200ExtraLight, 
    Montserrat_300Light, 
    Montserrat_400Regular, 
    Montserrat_500Medium, 
    Montserrat_600SemiBold, 
    Montserrat_700Bold, 
    Montserrat_800ExtraBold, 
    Montserrat_900Black, 
    Montserrat_100Thin_Italic, 
    Montserrat_200ExtraLight_Italic, 
    Montserrat_300Light_Italic, 
    Montserrat_400Regular_Italic, 
    Montserrat_500Medium_Italic, 
    Montserrat_600SemiBold_Italic, 
    Montserrat_700Bold_Italic, 
    Montserrat_800ExtraBold_Italic, 
    Montserrat_900Black_Italic
  });

  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkAuth = async () => {
      const inLoginScreen = segments[0] === 'login';

      if (!inLoginScreen) {
        try {
          await getCurrentUser();
          // If user fetch is successful means everything's good
        } catch (error) {
          console.warn('User not authenticated:', error);
          router.replace('/login');
        }
      }

      setCheckingAuth(false);
    };

    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!fontsLoaded || checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="scoreList" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaView>
  );
}
