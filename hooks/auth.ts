import { useEffect } from "react";
import OriginURL from "../constants/OriginURL";
import request from "../utils/request";
import { Link, useRouter, useSegments } from "expo-router";
import axios from "axios";

export interface IRegister {
  email: string;
  password: string;
}

const useAuth = () => {
  const segments = useSegments();
  const router = useRouter();
  
  const signIn = async({
    email,
    password
  }: IRegister) => {

    // const signInInfo = await request(`${OriginURL}/auth`)
    // console.log(signInInfo);
    const data = await axios.post(`${OriginURL}/auth/login`,  {
      email: email.trim(),
      password: password.trim()
    })
    // const { data } = await request(`${OriginURL}/auth/login`, {
    //   method: "POST",
    //   data: {
    //     email: email.trim(),
    //     password: password.trim()
    //   }
    // })

    console.log("signIn:", data)
  }

  const signOut = () => {
    console.log(signOut)
  }

  const checkToken = async() => {
    
    const {
      data,
      status
    } = await request(`${OriginURL}/auth`)
    
    if(status === 200) {
      console.log(data);
    }
  }

  const register = async({
    email,
    password
  }: IRegister) => {
    const { data } = await request(`${OriginURL}/register`, {
      method: "POST",
      data: {
        email: email.trim(),
        password: password.trim()
      }
    })

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