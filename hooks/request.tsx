import { useEffect } from "react";
import OriginURL from "../constants/OriginURL";
// import request from "../utils/request";
import { Link, useRouter, useSegments } from "expo-router";
import axios, { AxiosError } from "axios";
import { useAxios } from "../store/axios";
import useUser, { TUser } from "../store/user";
import useCommonStore from "../store/common";
import { TDemand } from "../store/demand";
import { useWStore } from "./ws";
import usePendingChat from "../store/pendingChat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I0Uath, IAuthResponse, IGoogleUser } from "../typings/auth";
import * as Google from "expo-auth-session/providers/google";
import useAuth from "./auth";
import { AuthSessionResult } from "expo-auth-session";

const useRequest = () => {
  const instance = useAxios((state) => state.instance);
  const { setChatInfo } = usePendingChat();
  const { setUser, user } = useUser();
  const { googleAuth } = useAuth();
  // const { ws } = useWStore();

  const [request, response, googleAuthPromptAsync] = Google.useAuthRequest({
    expoClientId:
      "550771065328-4n6ifetk14ipohju31nph1f6uq5qft6u.apps.googleusercontent.com",
    // expoClientkey: "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",
    scopes: ["openid", "profile", "email"],
    iosClientId:
      "550771065328-atnp8mu1i608tf3shsq571i25brjat1g.apps.googleusercontent.com",
    // ...{ useProxy: true },
    // redirectUri: "com.erickuang.fisherappopt:/oauth2redirect/google",

    // redirectUri: makeRedirectUri({e
    //   scheme:
    //     // "expo-development-client/?url=https://u.expo.dev/86fa0b0f-8462-458c-a245-9198c618f45a?channel-name=preview",
    //     "leapqr",
    //   path: "redirect",
    // }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;

      // console.log(authentication, "authentication");
      AsyncStorage.setItem(
        "googleToken",
        authentication?.accessToken as string
      );
      AsyncStorage.setItem(
        "googleTokenExpiresIn",
        authentication?.expiresIn?.toString() as string
      );

      googleAuthLogin(response);
    }
  }, [response]);
  // const googleAuthSignUp = async () => {

  //   console.log(response, "reponse,;;;a;ds;f");
  // };

  const googleAuthLogin = async (
    authResponse: any
  ): Promise<IGoogleUser | undefined> => {
    const token = await AsyncStorage.getItem("googleToken");
    const accessTokenExpiresIn = await AsyncStorage.getItem(
      "googleTokenExpiresIn"
    );

    const response = await axios
      .get<Promise<IGoogleUser>>("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error: AxiosError) => {
        console.log(error?.response?.data, "error");
      });

    const userInfo = await response?.data;

    if (userInfo) {
      // console.log(userInfo, "userInfo.....");

      const gAuth = await googleAuth({
        email: userInfo.email,
        // ramdom password
        password: "123456",
        username: userInfo.name,
        avatar: userInfo.picture,
        openId: userInfo.id,
        authExpiresAt: accessTokenExpiresIn,
        authToken: token as string,
      });

      setUser(gAuth);
    }

    return response?.data;
  };

  const getUser = async (userId: string): Promise<TUser | undefined> => {
    console.log(userId, "!!!");
    const response = await instance?.get<TUser>(`/users/single/${userId}`);

    return response?.data;
  };

  const startChat = async (_demand: TDemand, message: string) => {
    const toUserId = _demand.userId;

    console.log(toUserId, "demand userId......");
    const toUser = await getUser(toUserId);

    if (user && toUser) {
      setChatInfo({
        message,
        user: toUser,
        demandId: _demand.id,
        type: "demand",
      });

      return;
    }

    throw new Error("user not exsit");
    // this,updateUserContact();
  };

  const updateUsername = async (username: string) => {
    setUser({
      ...user,
      username,
    } as TUser);

    return await instance?.patch(`/users/${user?.id}/usename`, {
      username,
    });
  };

  const updateUserAvatar = async (avatar: string) => {
    setUser({
      ...user,
      avatar,
    } as TUser);
    return await instance?.patch(`/users/${user?.id}/avatar`, {
      avatar,
    });
  };

  const updateUserContact = async (toUserId: string) => {
    // setUser({
    //   ...user,
    //   avatar,
    // } as TUser);
    return await instance?.patch(`/users/${user?.id}/contact`, {
      toUserId,
    });
  };

  const updateDemandStatus = async (
    demandId: string,
    status: TDemand["status"]
  ): Promise<TDemand | undefined> => {
    const response = await instance?.patch<TDemand>(
      `/demand/${demandId}/status`,
      {
        status,
      }
    );

    return response?.data;
  };

  // const getAllSelfDemands = async () => {
  //   const demandResponse = await instance?.get(`/demand/${user?.id}`);

  //   if (demandResponse?.status === 200) {
  //     setUser({
  //       ...(user as TUser),
  //       demands: demandResponse.data,
  //     });
  //   }
  // };

  const createDemand = async (demandInfo: TDemand): Promise<TDemand> => {
    // console.log(demandInfo, "demandInfo");
    const response = await instance?.post("/demand/create", demandInfo);
    return response?.data;
    // await getAllSelfDemands();
  };

  return {
    getUser,
    startChat,
    updateUsername,
    updateUserAvatar,
    updateUserContact,
    updateDemandStatus,
    createDemand,
    // googleAuthLogin,
    googleAuthPromptAsync,
  };
};

export default useRequest;
