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

  return { getUser };
};

export default useRequest;
