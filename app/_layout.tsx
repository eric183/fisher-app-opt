import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { AlertDialog, NativeBaseProvider, Progress, View, Button } from 'native-base';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import useAuth from '../hooks/auth';
import { useAxios } from '../store/axios';
import useDemandState, { TDemand } from '../store/demand';
import useDemands from '../store/demand';
import { OpenAIStreamPayload, gptAPI } from '../utils/gpt';
import { Alert, Text } from "native-base";
import useUser from '../store/user';
import useMatch from '../store/match';
import isJSON from '../utils/isJSON';
import { io } from 'socket.io-client';
import useWS, { useWStore } from '../hooks/ws';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const { setWebsocket } = useWStore()
  const [wsListen] = useWS();
  const { setAllDemands, alldemands, pendingDemand, setDemandStatus } = useDemands();
  const { user } = useUser();
  const { setMatchInfo } = useMatch();
  const { signIn, signOut, checkToken } = useAuth();
  const { init, instance, loginStatus } = useAxios();
  const [sliceIndex, setSliceIndex] = useState<number>(0);
  const router = useRouter();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // remove user Me
  const currentMatchingDemands = useMemo(() => alldemands.filter((d) => d.userId !== user?.id), [alldemands]);
  
  // console.log(currentMatchingDemands, '...aaa');
  // console.log(user?.id, '...uuu');
  const getAllDemands = async() => {
    const demandReponse = await instance?.get("/demand/all")
    
    if(demandReponse?.data) {
      setAllDemands(demandReponse.data)
    }
  }


  // TO FIXED AND TO REFINE LOGIC  -- 需要优化！！！
  const onDemandsMatching = async (promptVal: string) => {
    promptVal = promptVal.trim();

    if (promptVal) {
      const currentDemands = alldemands.filter((d) => d.userId !== user?.id).slice(sliceIndex, sliceIndex + 10);


      if(currentDemands.length === 0) {
        setMatchInfo(false);
        return;
      } 
      
      const responseData = await gptAPI(embeddingPropmt(promptVal, currentDemands));
      const reponseJSON = responseData.choices[0].message.content
      var isJSON = (reponseJSON.toLowerCase() === "false") ? false : reponseJSON;

      if(isJSON) {  
        setMatchInfo(JSON.parse(reponseJSON));
        return 
      } 

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
    if(!process.env.WEBSOCKET_URL) {
      console.error('No websocket url dettacted!!!')
      return;
    }
    
    setWebsocket(io(process.env.WEBSOCKET_URL, {
      transports: ['websocket'],
    }));

    init();
  },[])

  useEffect(() => {
   
    console.log(loginStatus, '...');
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
  const { matchInfo, setMatchInfo } = useMatch();
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const cancelRef = useRef(null);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

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

  const onClose = () => {
    setMatchInfo(undefined)
    setAlertOpen(false);
  }

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

  useEffect(() => {
    if(typeof matchInfo === 'boolean') {
      setAlertOpen(true);
    }
    
    if(typeof matchInfo === 'object') {
      setAlertOpen(true);
    }
  },[matchInfo]);

  console.log('machinfo.....', matchInfo)
  return (
    <>
      <NativeBaseProvider>
        <ThemeProvider value={DefaultTheme}>
          {
          //  ((demandStatus === "Pending" || demandStatus === "Registed") && showProgress ) && <Progress value={progressMove()}  />
           showProgress && <Progress value={progressMove()}  />
          }

          <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertOpen} onClose={onClose}>
            <AlertDialog.Content>
              <AlertDialog.CloseButton />
              <AlertDialog.Header>匹配结果</AlertDialog.Header>
              <AlertDialog.Body textAlign="center">
                {
                  matchInfo ? JSON.stringify(matchInfo) : "抱歉没有匹配结果，请返回修改或者下次再来" 
                }
              </AlertDialog.Body>
              <AlertDialog.Footer justifyContent="center">
                <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                  Got it!
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog>
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
