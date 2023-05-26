import { useEffect } from "react";
import OriginURL from "../constants/OriginURL";
// import request from "../utils/request";
import { Link, useRouter, useSegments } from "expo-router";
import axios from "axios";
import { useAxios } from "../store/axios";
import useUser, { TUser } from "../store/user";
import useCommonStore from "../store/common";
import { TDemand } from "../store/demand";
import { useWStore } from "./ws";
import usePendingChat from "../store/pendingChat";

export interface IRegister {
  email: string;
  password: string;
}

const useRequest = () => {
  const instance = useAxios((state) => state.instance);
  const { setChatInfo } = usePendingChat();
  const { setUser, user } = useUser();
  // const { ws } = useWStore();

  const getUser = async (userId: string): Promise<TUser | undefined> => {
    console.log(userId, "toUser!!!");

    const response = await instance?.get<TUser>(`/users/single/${userId}`);

    return response?.data;
  };

  const startChat = async (_demand: TDemand, message: string) => {
    const toUserId = _demand.userId;
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
    console.log(demandInfo, "demandInfo");
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
  };
};

export default useRequest;
