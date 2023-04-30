import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { NativeBaseProvider, Progress } from 'native-base';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import useAuth from '../hooks/auth';
import { useAxios } from '../store/axios';
import useDemandState from '../store/demand';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const { signIn, signOut, checkToken } = useAuth();
  const { init, instance, loginStatus } = useAxios();
  const router = useRouter();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useLayoutEffect(() => {
    init();
  },[])

  useEffect(() => {
   
    if(loginStatus === "unauthenticated") {
      setTimeout(() => {
        router.push('/sign');
      }, 400);
      return;
    }
    // signIn();
  }, [loginStatus]);

  useEffect(() => {
   
    if(instance) {
      checkToken();
    }
    // signIn();
  }, [instance]);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { demandStatus } = useDemandState();
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  console.log(demandStatus, '...');

  useEffect(() => {

    if(demandStatus === "Pending") {
      setShowProgress(true);
    }

    if(demandStatus === "Registed") {
      setTimeout(()=> {
        setShowProgress(false);
      }, 1500);
    }
  },[demandStatus])


  const progressMove = () => {
    switch(demandStatus) {
      case "Pending" : {
        return 20
      }
      case "Registed": {
        if(showProgress) {
          return 60;
        }

        return 100;
      }
    }
  }


  return (
    <>
      <NativeBaseProvider>
        <ThemeProvider value={DefaultTheme}>
          {
           ((demandStatus === "Pending" || demandStatus === "Registed") && showProgress ) && <Progress value={progressMove()}  />
          }

          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </NativeBaseProvider>
    </>
  );
}
