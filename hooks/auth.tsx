import { useEffect } from "react";
import OriginURL from "../constants/OriginURL";
// import request from "../utils/request";
import { Link, useRouter, useSegments } from "expo-router";
import axios from "axios";
import { useAxios } from "../store/axios";
import useUser, { TUser } from "../store/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface IRegister {
  email: string;
  password: string;
  username: string;
  avatar?: string;
  openId?: string;
  authToken?: string;
  authExpiresAt?: any;
}

const useAuth = () => {
  const instance = useAxios((state) => state.instance);
  const { setUser, user } = useUser();

  const sendEmailVerification = async (email: string) => {
    const data = await instance?.post(`/auth/sendMailVerification`, {
      email: email.trim(),
    });
    return data;
  };

  const checkEmail = async (email: string) => {
    const data = await instance
      ?.post(`/auth/checkEmail`, {
        email: email.trim(),
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    return data;
  };

  const signIn = async ({
    email,
    password,
  }: Pick<IRegister, "email" | "password">) => {
    const data = await instance
      ?.post(`/auth/login`, {
        email: email.trim(),
        password: password.trim(),
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    return data;
  };

  const signOut = () => {
    console.log(signOut);
  };

  const resetPassword = async (email: string, password: string) => {
    const data = await instance?.post(`/users/password`, { password, email });
    if (data?.data) {
      return await signIn({
        email,
        password,
      });
    }
  };

  const checkToken = async () => {
    const profileResponse = await instance
      ?.get("/auth/profile")
      .catch((err) => {
        console.log("checkToken", err);

        return Promise.reject(err);
      });

    // console.log(profileResponse, "profileResponse");
    if (!profileResponse) return;

    const demandResponse = await instance?.get(
      `/demand/${profileResponse.data.id}`
    );

    // console.log(demandResponse, "demandResponse");

    // const demandResponse = await instance?.get(`/demand/count/${data.id}`)!;

    if (profileResponse?.status === 200) {
      setUser({
        ...profileResponse.data,
        demands: demandResponse?.data,
        // demandCount: demandResponse.data.length
      });
      return true;
    }
  };

  const googleAuth = async ({
    email,
    password,
    username,
    avatar,
    openId,
    authExpiresAt,
    authToken,
  }: IRegister) => {
    const postUser = {
      email: email.trim(),
      password: password.trim(),
      username: username.trim(),
      avatar: avatar,
      openId: openId ? openId : "",
      authExpiresAt,
      authToken,
    };

    const response = await instance?.post(`/auth/googleAuth`, postUser);

    return response?.data;
    // if (response?.data === true) {
    //   return signIn(postUser);
    // }
  };

  const register = async ({
    email,
    password,
    username,
    avatar,
    openId,
    authExpiresAt,
    authToken,
  }: IRegister) => {
    const postUser = {
      email: email.trim(),
      password: password.trim(),
      username: username.trim(),
      avatar: avatar,
      openId: openId ? openId : "",
      authExpiresAt,
      authToken,
    };

    const response = await instance?.post(`/auth/register`, postUser);

    if (response?.data === true) {
      return signIn(postUser);
    }
    // console.log("isRegisted:", data)
  };

  return {
    signIn,
    signOut,
    checkToken,
    checkEmail,
    register,
    resetPassword,
    sendEmailVerification,
    googleAuth,
  };
};

export default useAuth;
