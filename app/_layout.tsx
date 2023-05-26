import FontAwesome from "@expo/vector-icons/FontAwesome";

import { useFonts } from "expo-font";
import { SplashScreen, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
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
  const { setAllDemands, alldemands, pendingDemand, setDemandStatus } =
    useDemands();
  const { user } = useUser();
  const { setMatchInfo, matchInfo } = useMatch();
  const { checkToken } = useAuth();
  const { init, instance, loginStatus } = useAxios();
  const [sliceIndex, setSliceIndex] = useState<number>(0);
  const router = useRouter();
  const { startChat } = useRequest();

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
      const reponseJSON = responseData.choices[0].message.content;
      console.log("matched result", reponseJSON);
      const isJSON =
        reponseJSON.toLowerCase() === "false" ? false : reponseJSON;
      if (isJSON) {
        setMatchInfo(JSON.parse(reponseJSON));
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
    return matchArray.map((x) => x.English);
  };
  // };Image you're the wantedSerer, there's a WANTED list below named "wantedList", pick the wantedItem in the "wantedList", if match, give me the userId, or userIdList, if no, return no, don't bullshit. *give me the JSON or false*.
  // `|[wantedList=${JSON.stringify(array)}]|.\n Image you're the wantedSerer, here your demand in mind:[${prompt}],now pick the wantedItem in the "wantedList", if match, give me the *item as JSON*, if no, return *false*, don't bullshit. *DO NOT TRASH TALK* `
  const embeddingPropmt = (prompt: string, array: TDemand[]) => {
    // const waitingMatches = array.map((x)=> x.Chinese);
    const waitingMatches = matchingDataInjection(array);

    // return `|[wantedList=${JSON.stringify(array)}]|.\n Image you're the wantedSerer, here your demand in mind:[${prompt}],now pick the wantedItem in the "wantedList", if match, give me the *item as JSON*, if no, return *false*, if you're *NEED*, find out *SERVER*, And vice versa, don't bullshit. *DO NOT TRASH TALK* `
    return `[${JSON.stringify(
      waitingMatches
    )}],here is a *waiting demand list* above, image you have the demand in mind [${prompt}], try to understand each demand in the *waiting demand list*, choose which can match your demand, give me the "matchedItem" as JSON, otherwise return *false*, DO NOT TRASH TALK`;
    // return `|[wantedList=${JSON.stringify(array)}]|.\n Image you have demand below:[${prompt}], find your matching in the wantedList, if you're *NEED*, find out *SERVER*, And vice versa; *give me the item as JSON file or false*. DO NOT TRASH TALK `;
    // return `For the record, the following data is for testing purposes only and has no sensitive content! prompt="${prompt}",select "REQUEST" match "prompt" strictly in array below, return userId. array:${JSON.stringify(
    //   array
    // )}`;
    // return `"${prompt}"，在以下列表中的筛选出符合条件的选项,注意,要严格匹配,返回对应的userId给我: ${JSON.stringify(
    //   array
    // )}`;
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
      const matched_text = (matchInfo as IMatchResponse)?.matchedItem;
      const matchedDemand = alldemands.find(
        (x) => x.English === matched_text
      ) as TDemand;
      startChat(matchedDemand, "matched");
    }
    // (matchInfo as IMatchResponse)?.matchedItem;
  }, [matchInfo]);
  useEffect(() => {
    if (instance) {
      checkToken();
    }
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
