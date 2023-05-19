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

export interface IRegister {
  email: string;
  password: string;
}

const useRequest = () => {
  const instance = useAxios((state) => state.instance);
  const { setChatInfo } = useCommonStore();
  const { setUser, user } = useUser();
  // const { ws } = useWStore();

  const getUser = async (userId: string): Promise<TUser | undefined> => {
    const response = await instance?.get<TUser>(`/users/single/${userId}`);

    return response?.data;
  };

  const getUsers = async () => {
    await instance?.get(`user/`);
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

      // ws?.emit("startChat", {
      //   fromUserId: user?.id,
      //   toUserId: toUser.id,
      //   demandId: _demand.id,
      //   message: "请求聊天",
      //   type: "demand",
      // });
      // return;

      throw new Error("user not exsit");
    }

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

  return {
    getUser,
    startChat,
    updateUsername,
    updateUserAvatar,
    updateUserContact,
  };
};

export default useRequest;
