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

const useAuth = () => {

  const  instance  = useAxios(state => state.instance);
  const { setUser } = useUser();

  const signIn = async({
    email,
    password
  }: IRegister) => {

    const data = await instance?.post(`/auth/login`, {
      email: email.trim(),
      password: password.trim()
    });

    return data;
 

  }

  const signOut = () => {
    console.log(signOut)
  }

  const checkToken = async() => {
    
 
    const profileResponse = await instance?.get('/auth/profile')!;
    if(!profileResponse) return;
    const demandResponse = await instance?.get(`/demand/${profileResponse.data.id}`)!;
    // const demandResponse = await instance?.get(`/demand/count/${data.id}`)!;
    
    if(profileResponse?.status === 200) {
      setUser({
        ...profileResponse.data,
        demands: demandResponse.data,
        // demandCount: demandResponse.data.length
      });
    }
  }

  const register = async({
    email,
    password
  }: IRegister) => {
    const postUser = {
      email: email.trim(),
      password: password.trim()
    }

    const response = await instance?.post(`/register`, postUser)

    if(response?.data === true) {
      return signIn(postUser);
    }
    // console.log("isRegisted:", data)
  }

  // useEffect(() => {
  //   checkToken()
  //   console.log(segments, '...')

  //   const inAuthGroup = segments[0] === "(auth)";

  //   if(!inAuthGroup) {
  //     setTimeout(() => {
  //       router.replace("/sign")
  //     },1000)

  //   }
    
  // }, [segments]);

  return { signIn, signOut, checkToken, register };
}


export default useAuth;