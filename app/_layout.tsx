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

  const setTempDemandToRandomUser = (data: any) => {
    debugger;
    const demandConllection = getDemansJSON();


    
  }

  // remove user Me
  const currentMatchingDemands = useMemo(() => alldemands.filter((d) => d.userId !== user?.id), [alldemands]);

  // console.log(currentMatchingDemands, '...aaa');
  // console.log(user?.id, '...uuu');
  const getAllDemands = async() => {
    const demandReponse = await instance?.get("/demand/all")
    // getAllUsers();
    if(demandReponse?.data) {
      setAllDemands(demandReponse.data)

    }
  }
  
  
  const getAllUsers = async() => {
    const demandReponse = await instance?.get("/users")
    
    setTempDemandToRandomUser(demandReponse);
    
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




function getDemansJSON() {
  [
    {
      User: 1,
      "Request in Chinese":
        "我想要在白宫附件租赁一个高层住宅，面积不限，月租金在3000美元以内",
      "Request in English":
        "I want to rent a high-rise apartment near the White House with an area unlimited and a monthly rent that is below $3000.",
    },
    {
      User: 2,
      "Request in Chinese":
        "目前因为遗产继承问题陷入一个官司里面，希望找以为有经验的律师代理案",
      "Request in English":
        "Currently, I am caught up in a legal battle due to inheritance issues and I am looking for an experienced lawyer to represent me in the case.",
    },
    {
      User: 3,
      "Request in Chinese": "想找一位教练提高游泳技术",
      "Request in English":
        "I want to find a coach to improve my swimming skills.",
    },
    {
      User: 4,
      "Request in Chinese": "想找一个羽毛球教练提高球技，在华盛顿特区内均可。",
      "Request in English":
        "I want to find a badminton coach to improve my skills, anywhere in Washington DC.",
    },
    {
      User: 5,
      "Request in Chinese": "想找一个数学老师补习数学，时间是每周一和周六的晚上",
      "Request in English":
        "I want to find a math teacher for extra tutoring sessions on Monday and Saturday evenings.",
    },
    {
      User: 6,
      "Request in Chinese":
        "我是一个大学数学老师，可以提供数学教学，仅限每周六和周日白天。",
      "Request in English":
        "I am a university math teacher and I can provide math tutoring, but only on weekends during the day.",
    },
    {
      User: 7,
      "Request in Chinese":
        "想要为我的生日派对预定一个场地，可以容纳30人或者以上的。",
      "Request in English":
        "I want to reserve a venue for my birthday party that can accommodate 30 people or more.",
    },
    {
      User: 8,
      "Request in Chinese": "从华盛顿特区出发前往伦敦旅行，想要寻找同路人",
      "Request in English":
        "I am looking for travel companions from Washington DC to London.",
    },
    {
      User: 9,
      "Request in Chinese": "想要寻找在华盛顿的中国人",
      "Request in English":
        "I want to find Chinese people living in Washington DC.",
    },
    {
      User: 10,
      "Request in Chinese": "想要购买一批武器",
      "Request in English": "I want to purchase a batch of weapons.",
    },
    {
      User: 11,
      "Request in Chinese":
        "我正在寻找一位有3年以上法律诉讼经验的朋友作为公司合伙人",
      "Request in English":
        "I am looking for a friend with 3+ years of experience in legal litigation for a business partnership.",
    },
    {
      User: 12,
      "Request in Chinese": "我是一个资深的律师，在诉讼中拥有丰富的实战经验。",
      "Request in English":
        "I am a senior lawyer with rich practical experience in litigation.",
    },
    {
      User: 13,
      "Request in Chinese":
        "我是一个资深律师，对离婚案件的诉讼有丰富的诉讼经验。",
      "Request in English":
        "I have rich experience in litigation for divorce cases as a senior lawyer.",
    },
    {
      User: 14,
      "Request in Chinese":
        "我正准备搬离华盛顿公寓正在住的高层公寓准备转租，需要二手家具也可以联系我。",
      "Request in English":
        "I am preparing to move out of the high-rise apartment I am currently living in near Washington DC and am ready to sublease it. You may also contact me if you need second-hand furniture.",
    },
    {
      User: 15,
      "Request in Chinese": "我正在健身，想要找一位健身教练每周进行三次训练。",
      "Request in English":
        "I am working out and looking for a personal trainer for three sessions a week.",
    },
    {
      User: 16,
      "Request in Chinese": "我是一个视频制作人，可以提供有偿的视频制作服务。",
      "Request in English":
        "I am a video producer and can offer paid video production services.",
    },
    {
      User: 17,
      "Request in Chinese": "售卖各种轻机枪以及冲锋枪",
      "Request in English":
        "We are selling various light machine guns and submachine guns.",
    },
    {
      User: 18,
      "Request in Chinese": "我是一个来自中国的厨师，拥有15年的中国菜制作经验。",
      "Request in English":
        "I am a chef from China with 15 years of experience in Chinese cuisine.",
    },
    {
      User: 19,
      "Request in Chinese": "我有一个小当量核武器，闲置",
      "Request in English": "I have a small nuclear weapon for sale.",
    },
    {
      User: 20,
      "Request in Chinese": "从华盛顿驾车前往加州，计划时间是6月，寻找同路人",
      "Request in English":
        "I am looking for travel companions from Washington DC to California in June.",
    },
    {
      User: 21,
      "Request in Chinese": "我毕业于麻省理工大学汉语专业，想寻找一个实习职位。",
      "Request in English":
        "I graduated from MIT with a degree in Chinese and am looking for an internship.",
    },
    {
      User: 22,
      "Request in Chinese":
        "修车店，招收一名学徒，没有学历要求，但是需要对汽车充满热情",
      "Request in English":
        "We are recruiting an apprentice at our car repair shop, with no educational requirements but a passion for cars is necessary.",
    },
    {
      User: 23,
      "Request in Chinese": "正在搬家，希望购买一些二手家具，地点不限。",
      "Request in English":
        "I am moving and hoping to purchase some second-hand furniture, location not limited.",
    },
    {
      User: 24,
      "Request in Chinese":
        "我是一名男性，33岁，职业是投资人，希望寻找位以结婚位目标的女朋友。",
      "Request in English":
        "I am a 33-year-old male investor looking for a girlfriend with the goal of marriage.",
    },
    {
      User: 25,
      "Request in Chinese": "我是一名退役特种兵，寻找一份工作。",
      "Request in English":
        "As a retired special forces soldier, I am looking for a job.",
    },
    {
      User: 26,
      "Request in Chinese":
        "我是一位专业运动员，擅长的运动有羽毛球以及游泳，可以提供教练服务。",
      "Request in English":
        "I am a professional athlete, specializing in badminton and swimming, and can provide coaching services.",
    },
    {
      User: 27,
      "Request in Chinese": "在华盛顿特区寻找一位定期提供清洁服务的钟点工",
      "Request in English":
        "I am looking for a part-time hourly worker in Washington DC to provide regular cleaning services.",
    },
    {
      User: 28,
      "Request in Chinese": "销售各类武器，美国全境提供配送服务。",
      "Request in English":
        "We are selling various types of weapons and offer delivery services across the United States.",
    },
    {
      User: 29,
      "Request in Chinese": "想领养一只宠物，希望有人可以送我一只小狗。",
      "Request in English":
        "I want to adopt a pet and am hoping that someone can give me a small dog.",
    },
  ]
}