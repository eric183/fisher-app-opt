import { useEffect } from "react";
import OriginURL from "../constants/OriginURL";
// import request from "../utils/request";
import { Link, useRouter, useSegments } from "expo-router";
import axios from "axios";
import { useAxios } from "../store/axios";
import useUser, { TUser } from "../store/user";

export interface IRegister {
  email: string;
  password: string;
}

const useRequest = () => {
  const instance = useAxios((state) => state.instance);
  const { setUser, user } = useUser();

  const getUser = async (userId: string) => {
    const response = await instance?.get<TUser>(`/users/single/${userId}`);

    return response?.data;
  };

  const getUsers = async () => {
    await instance?.get(`user/`);
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

  // const usernameBinder = async ({ nativeEvent }: any) => {
  //   setShowTextInput(false);
  //   console.log(nativeEvent.text);

  //   instance?.patch(`/users/${user?.id}/usename`, {
  //     username: nativeEvent.text,
  //   });
  // };

  return { getUser, updateUsername, updateUserAvatar };
};

export default useRequest;
