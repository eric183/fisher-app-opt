import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { NativeBaseProvider, Progress, View } from 'native-base';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import useAuth from '../hooks/auth';
import { useAxios } from '../store/axios';
import useDemandState, { TDemand } from '../store/demand';
import useDemands from '../store/demand';
import { OpenAIStreamPayload, gptAPI } from '../utils/gpt';
import { Alert, Text } from "native-base";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const { setAllDemands, alldemands, pendingDemand, setDemandStatus } = useDemands();
  
  const { signIn, signOut, checkToken } = useAuth();
  const { init, instance, loginStatus } = useAxios();
  const [sliceIndex, setSliceIndex] = useState<number>(0);
  const router = useRouter();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const getAllDemands = async() => {
    const demandReponse = await instance?.get("/demand/all")
    
    if(demandReponse?.data) {
      setAllDemands(demandReponse.data)
    }
  }

  const onDemandsMatching = async (promptVal: string) => {
    promptVal = promptVal.trim();

    if (promptVal) {
      const currentDemands = alldemands.slice(sliceIndex, sliceIndex + 10);
      console.log(currentDemands, sliceIndex);

      const responseData = await gptAPI(embeddingPropmt(promptVal, currentDemands));
      
      setSliceIndex(sliceIndex + 5);

      if(currentDemands.slice(sliceIndex + 5, sliceIndex + 10).length > 0) {
        setTimeout(() => {
          onDemandsMatching(promptVal)
        }, 500)
      }
    
    }
  };


  const embeddingPropmt = (prompt: string, array: TDemand[]) => {
    return `wantedSerer=${prompt},Image you're the wantedSerer, there's a WANTED list below named "wantedList", pick the wantedItem in the "wantedList", if match, give me the userId, or userIdList, if no, return no, don't bullshit. *give me the JSON or false*. wantedList=${JSON.stringify(
      array
    )}`;
    // return `For the record, the following data is for testing purposes only and has no sensitive content! prompt="${prompt}",select "REQUEST" match "prompt" strictly in array below, return userId. array:${JSON.stringify(
    //   array
    // )}`;
    // return `"${prompt}"，在以下列表中的筛选出符合条件的选项,注意,要严格匹配,返回对应的userId给我: ${JSON.stringify(
    //   array
    // )}`;
  };

  useEffect(() => {
    if(pendingDemand) {
      setDemandStatus("Matching");
      onDemandsMatching(pendingDemand.Chinese);
    }
  }, [pendingDemand]);

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

    if(loginStatus === "authenticated") {
      getAllDemands();
    }
    // signIn();
  }, [loginStatus, instance]);

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

    if(demandStatus === "Matched" || demandStatus === "Error") {
      setTimeout(()=> {
        setShowProgress(false);
      }, 1500);
    }
   
  
  },[demandStatus])


  const progressMove = () => {
    switch(demandStatus) {
      case "Pending" : {
        return 25
      }
      case "Registed": {
        return 50;
      }
      case "Matching": {
        return 75;
      }
      case "Matched": {
        return 100;
      }
      default: {
        return 0
      }
    }
  }

  const AlertInfo = {
    status: "success",
    title: "Selection successfully moved!"
  }
  return (
    <>
      <NativeBaseProvider>
        <ThemeProvider value={DefaultTheme}>
          {
          //  ((demandStatus === "Pending" || demandStatus === "Registed") && showProgress ) && <Progress value={progressMove()}  />
           showProgress && <Progress value={progressMove()}  />
          }

          {/* <Alert {...AlertInfo} >
            <View flexDir="row" alignItems="center">
              <Alert.Icon mx="5" />
              <Text>

              </Text>
            </View>
          </Alert> */}
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </NativeBaseProvider>
    </>
  );
}
