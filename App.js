import * as SplashScreen from 'expo-splash-screen';

import { useEffect } from 'react';
import { useFonts } from 'expo-font';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigation from './src/navigation';

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [loaded, error] = useFonts({
        StoryScript: require('./assets/fonts/story-script.otf'),
        NotoSans: require('./assets/fonts/noto-sans.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView>
                <AppNavigation />
            </GestureHandlerRootView>

            <StatusBar style='auto' hidden={true} />
        </SafeAreaProvider>
    );
}

