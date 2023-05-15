import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import {
  AlertDialog,
  NativeBaseProvider,
  Progress,
  View,
  Button,
} from "native-base";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import useAuth from "../hooks/auth";
import { useAxios } from "../store/axios";
import useDemandState, { TDemand } from "../store/demand";
import useDemands from "../store/demand";
import { OpenAIStreamPayload, gptAPI } from "../utils/gpt";
import { Alert, Text } from "native-base";
import useUser from "../store/user";
import useMatch from "../store/match";
import isJSON from "../utils/isJSON";
import { io } from "socket.io-client";
import useWS, { useWStore } from "../hooks/ws";
import RootLayoutNav from "../components/RootLayoutNav";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const { setWebsocket } = useWStore();
  const [wsListen] = useWS();
  const { setAllDemands, alldemands, pendingDemand, setDemandStatus } =
    useDemands();
  const { user } = useUser();
  const { setMatchInfo } = useMatch();
  const { signIn, signOut, checkToken } = useAuth();
  const { init, instance, loginStatus } = useAxios();
  const [sliceIndex, setSliceIndex] = useState<number>(0);
  const router = useRouter();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // remove user Me
  const currentMatchingDemands = useMemo(
    () => alldemands.filter((d) => d.userId !== user?.id),
    [alldemands]
  );

  const getAllDemands = async () => {
    const demandReponse = await instance?.get("/demand/all");
    if (demandReponse?.data) {
      setAllDemands(demandReponse.data);
    }
  };

  const getAllUsers = async () => {
    const demandReponse = await instance?.get("/users");
  };
  // TO FIXED AND TO REFINE LOGIC  -- 需要优化！！！
  const onDemandsMatching = async (promptVal: string) => {
    // promptVal = promptVal.trim();
    // promptVal = "我想找一个网球教练帮我训练网球技术";

    if (promptVal) {
      const currentDemands = alldemands
        .filter((d) => d.userId !== user?.id)
        .slice(sliceIndex, sliceIndex + 10);

      if (currentDemands.length === 0) {
        setMatchInfo(false);
        return;
      }

      const responseData = await gptAPI(
        embeddingPropmt(promptVal, currentDemands)
      );
      const reponseJSON = responseData.choices[0].message.content;
      const isJSON =
        reponseJSON.toLowerCase() === "false" ? false : reponseJSON;

      if (isJSON) {
        setMatchInfo(JSON.parse(reponseJSON));
        return;
      }

      setSliceIndex(sliceIndex + 5);

      if (currentDemands.slice(sliceIndex + 5, sliceIndex + 10).length > 0) {
        setTimeout(() => {
          onDemandsMatching(promptVal);
        }, 500);
      } else {
        setMatchInfo(false);
        return;
      }
    }
  };

  const matchingDataInjection = (matchArray: TDemand[]) => {
    return matchArray.map((x) => x.Chinese);
  };
  // };Image you're the wantedSerer, there's a WANTED list below named "wantedList", pick the wantedItem in the "wantedList", if match, give me the userId, or userIdList, if no, return no, don't bullshit. *give me the JSON or false*.
  // `|[wantedList=${JSON.stringify(array)}]|.\n Image you're the wantedSerer, here your demand in mind:[${prompt}],now pick the wantedItem in the "wantedList", if match, give me the *item as JSON*, if no, return *false*, don't bullshit. *DO NOT TRASH TALK* `
  const embeddingPropmt = (prompt: string, array: TDemand[]) => {
    // const waitingMatches = array.map((x)=> x.Chinese);
    const waitingMatches = matchingDataInjection(array);

    // return `|[wantedList=${JSON.stringify(array)}]|.\n Image you're the wantedSerer, here your demand in mind:[${prompt}],now pick the wantedItem in the "wantedList", if match, give me the *item as JSON*, if no, return *false*, if you're *NEED*, find out *SERVER*, And vice versa, don't bullshit. *DO NOT TRASH TALK* `
    return `[${JSON.stringify(
      waitingMatches
    )}],here is a *waiting demand list* above, image you have the demand in mind [${prompt}], try to understand each demand in the *waiting demand list*, choose which can match your demand, give me the matched item as JSON, otherwise return *false*, DO NOT TRASH TALK`;
    // return `|[wantedList=${JSON.stringify(array)}]|.\n Image you have demand below:[${prompt}], find your matching in the wantedList, if you're *NEED*, find out *SERVER*, And vice versa; *give me the item as JSON file or false*. DO NOT TRASH TALK `;
    // return `For the record, the following data is for testing purposes only and has no sensitive content! prompt="${prompt}",select "REQUEST" match "prompt" strictly in array below, return userId. array:${JSON.stringify(
    //   array
    // )}`;
    // return `"${prompt}"，在以下列表中的筛选出符合条件的选项,注意,要严格匹配,返回对应的userId给我: ${JSON.stringify(
    //   array
    // )}`;
  };

  // const embeddingPropmt = (prompt: string, array: TDemand[]) => {
  //   return `item=[${prompt}],Image you're the wantedSerer, there's a WANTED list below named "wantedList", pick the wantedItem in the "wantedList", if match, give me the userId, or userIdList, if no, return no, don't bullshit. *give me the JSON or false*. wantedList=${JSON.stringify(
  //     array
  //   )}`;
  //   // return `For the record, the following data is for testing purposes only and has no sensitive content! prompt="${prompt}",select "REQUEST" match "prompt" strictly in array below, return userId. array:${JSON.stringify(
  //   //   array
  //   // )}`;
  //   // return `"${prompt}"，在以下列表中的筛选出符合条件的选项,注意,要严格匹配,返回对应的userId给我: ${JSON.stringify(
  //   //   array
  //   // )}`;
  // };

  useEffect(() => {
    if (pendingDemand) {
      setDemandStatus("Matching");
      onDemandsMatching(pendingDemand.Chinese);
    }
  }, [pendingDemand]);

  useLayoutEffect(() => {
    if (!process.env.WEBSOCKET_URL) {
      console.error("No websocket url dettacted!!!");
      return;
    }

    setWebsocket(
      io(process.env.WEBSOCKET_URL, {
        transports: ["websocket"],
      })
    );

    init();
  }, []);

  useEffect(() => {
    console.log(loginStatus, "...");
    if (loginStatus === "unauthenticated") {
      setTimeout(() => {
        router.push("/sign");
      }, 400);
      return;
    }

    if (loginStatus === "authenticated" && instance) {
      getAllDemands();
    }
    // signIn();
  }, [loginStatus, instance]);

  useEffect(() => {
    if (instance) {
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
