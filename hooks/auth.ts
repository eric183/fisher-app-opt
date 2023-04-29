import { useEffect } from "react";
import OriginURL from "../constants/OriginURL";
// import request from "../utils/request";
import { Link, useRouter, useSegments } from "expo-router";
import axios from "axios";
import { useAxios } from "../store/axios";


export interface IRegister {
  email: string;
  password: string;
}

const useAuth = () => {
  const segments = useSegments();
  const router = useRouter();
  const  instance  = useAxios(state => state.instance);
  
  const signIn = async({
    email,
    password
  }: IRegister) => {

    // const signInInfo = await request(`${OriginURL}/auth`)
    console.log(instance);
    const data = await instance?.post(`${OriginURL}/auth/login`, {
      email: email.trim(),
      password: password.trim()
    });
    // const data = await axios.post(`${OriginURL}/auth/login`,  {
    //   email: email.trim(),
    //   password: password.trim()
    // })
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
    
    // const {
    //   data,
    //   status
    // } = await 
    instance?.get(`${OriginURL}/auth/profile`)
    // debugger;
    // if(status === 200) {
    //   console.log(data);
    // }
  }

  const register = async({
    email,
    password
  }: IRegister) => {
    const data = await instance?.post(`${OriginURL}/register`, {
      email: email.trim(),
      password: password.trim()
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