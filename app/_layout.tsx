import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import { SplashScreen, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import useAuth from "../hooks/auth";
import { useAxios } from "../store/axios";
import { TDemand } from "../store/demand";
import useDemands from "../store/demand";
import { gptAPI } from "../utils/gpt";
import useUser from "../store/user";
import useMatch, { IMatchResponse } from "../store/match";
import { io } from "socket.io-client";
import useWS, { useWStore } from "../hooks/ws";
import RootLayoutNav from "../components/RootLayoutNav";
import useRequest from "../hooks/request";
import usePendingChat from "../store/pendingChat";
import { Alert } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const { chatInfo } = usePendingChat();
  const { setWebsocket } = useWStore();
  const [ws] = useWS();
  const { setAllDemands, alldemands, pendingDemand, setDemandStatus } =
    useDemands();
  const { user } = useUser();

  const { setMatchInfo, matchInfo } = useMatch();
  const { checkToken } = useAuth();
  const { init, instance, loginStatus, errorInfo } = useAxios();
  const [sliceIndex, setSliceIndex] = useState<number>(0);
  const { startChat } = useRequest();
  const router = useRouter();

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const getAllDemands = async () => {
    const demandReponse = await instance?.get("/demand/all");
    if (demandReponse?.data) {
      setAllDemands(demandReponse.data);
    }
  };

  const matchDemandsFilter = (
    alldemands: TDemand[],
    pendingDemand: TDemand
  ): TDemand[] => {
    const { userId, status, demandRole, place, categoryType } = pendingDemand;
    const _demands = alldemands.filter(
      (d) =>
        d.userId !== userId && // 去掉不是本人的任务
        d.place?.name !== place?.name && // 地址一样
        // d.categoryType === categoryType && // 筛选同类任务
        status === "OPEN" && // 筛选开放的任务
        d.demandRole !== demandRole // 去掉同类任务角色
    );

    return _demands;
  };
  // TO FIXED AND TO REFINE LOGIC  -- 需要优化！！！
  // promptVal: string
  const onDemandsMatching = async (pendingDemand: TDemand) => {
    // promptVal = promptVal.trim();
    // promptVal = "我想找一个网球教练帮我训练网球技术";

    if (pendingDemand.English) {
      const currentDemands = matchDemandsFilter(
        alldemands,
        pendingDemand
      ).slice(sliceIndex, sliceIndex + 10);

      if (currentDemands.length === 0) {
        setMatchInfo(false);
        return;
      }

      console.log("currentDemands", currentDemands);
      const responseData = await gptAPI(
        embeddingPropmt(pendingDemand.English, currentDemands)
      );
      const reponseData = responseData.choices[0].message.content;
      console.log("matched result", reponseData);
      const reponseJSON = JSON.parse(reponseData);
      if (reponseJSON.matchedItem) {
        setMatchInfo(reponseJSON);
        return;
      }

      setSliceIndex(sliceIndex + 5);

      if (currentDemands.slice(sliceIndex + 5, sliceIndex + 10).length > 0) {
        setTimeout(() => {
          onDemandsMatching(pendingDemand);
        }, 500);
      } else {
        setMatchInfo(false);
        return;
      }
    }
  };

  const matchingDataInjection = (matchArray: TDemand[]) => {
    return matchArray.map<Partial<TDemand>>((x: TDemand) => ({
      English: x.English,
      id: x.id,
    }));
  };

  const embeddingPropmt = (prompt: string, array: TDemand[]) => {
    const waitingMatches = matchingDataInjection(array);

    console.log(
      waitingMatches.map((x) => x.id),
      "waitingMatches ,....."
    );

    return `[${JSON.stringify(
      waitingMatches
    )}],here is a *waiting demand list* above, image you have the demand in mind [${prompt}],DO NOT CHANGE ID! try to understand each demand in the *waiting demand list*, choose which can match your demand, give me the "matchedItem" as JSON, otherwise return *"{}"*, DO NOT TRASH TALK, give me clean JSON format`;
  };

  useLayoutEffect(() => {
    if (!process.env.WEBSOCKET_URL) {
      console.error("No websocket url dettacted!!!");
      return;
    }

    init();
  }, []);

  useEffect(() => {
    if (pendingDemand) {
      setDemandStatus("Matching");
      onDemandsMatching(pendingDemand);
    }
  }, [pendingDemand]);

  useEffect(() => {
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
    if (user) {
      setWebsocket(
        io(process.env.WEBSOCKET_URL, {
          transports: ["websocket"],
          query: {
            userId: user?.id,
          },
        })
      );
    }
  }, [user]);

  useEffect(() => {
    if (matchInfo as IMatchResponse) {
      const matchedItem = (matchInfo as IMatchResponse)?.matchedItem as TDemand;

      const matchedDemand = alldemands.find(
        (x) => x.id === matchedItem.id
      ) as TDemand;

      console.log(matchedDemand, "IMatchResponse, mach");

      startChat(matchedDemand, "matched");
    }
    // (matchInfo as IMatchResponse)?.matchedItem;
  }, [matchInfo]);

  useEffect(() => {
    if (chatInfo) {
      console.log(chatInfo, "chatInfo, !klfjdaljkfjasl");
      ws?.emit("startChat", {
        fromUserId: user?.id as string,
        toUserId: chatInfo?.user.id as string,
        demandId: chatInfo?.demandId,
        message: "请求聊天",
        type: "demand",
      });

      router.push("/chat");
    }
  }, [chatInfo]);

  useEffect(() => {
    if (instance) {
      checkToken();
    }
  }, [instance]);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (errorInfo) {
      Alert.alert("Error", errorInfo.message);
    }
  }, [errorInfo]);

  return (
    <>
      {/* <SplashScreen /> */}
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}
