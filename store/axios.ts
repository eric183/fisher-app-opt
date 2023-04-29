import { create } from "zustand";
import axios, { AxiosInstance } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';



interface IAxiosState {
  loginStatus: LoginStatus,
  instance: AxiosInstance | null;
  init: () => void;
}

export const useAxios = create<IAxiosState>()((set) => ({
  loginStatus: "authenticated",
  instance: null,
  init: () => {

    const instance = axios.create({
      baseURL: process.env.APP_ORIGIN_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use(
      async(config) => {
        set({
          loginStatus: "pendingVerification"
        });

        const bearerToken =await AsyncStorage.getItem("token");

        config.headers.Authorization = `Bearer ${bearerToken}`;


        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => {
        if(response.data.access_token) {
          AsyncStorage.setItem("token", response.data.access_token);
          set({
            loginStatus: "authenticated"
          })
        }
        return response;
      },
      (error) => {
        if(error.code === "ERR_NETWORK") {
          return Promise.reject(error);
        }
        
        if (error?.response?.status === 401) {
          // handle 401 error
          set({
            loginStatus: "unauthenticated"
          })
        } else {
          return Promise.reject(error);
        }

        

      }
    );

    set({ instance });
  },
}));



// import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
// import { create } from 'zustand';

// interface IAxiosState {
//   statusCode: number | undefined;
//   // setStatusCode: (code: number) => void;
//   axiosInstance: AxiosInstance | undefined;
//   setAxiosInstance: (config: CreateAxiosDefaults<any>) => void;
// }

// const useAxios = create<IAxiosState>()((set) => ({
//   statusCode: undefined,
//   axiosInstance: undefined,

//   setAxiosInstance: (newConfig) => {
//     const newAxiosInstance = axios.create(newConfig)
  
//     newAxiosInstance.interceptors.request.use((config) => {
//       config.headers.common['Authorization'] = `Bearer ${global.AuthorizationToken}`;
//       return config;
//     });

//     newAxiosInstance.interceptors.response.use(
//       (response) => {
//         set(() => ({
//           statusCode: response.status
//         }));
//         return response;
//       },
//       (error) => {
//         debugger;
//         if (error.response && error.response.status === 401) {
//           // 处理 HTTP 401 响应
//           set(()=> ({
//             statusCode: 401
//           }))
//         }
        
//         return Promise.reject(error);
//       }
//     );
    
//     set((state) => ({
//       axiosInstance: newAxiosInstance,
//     }))
//   }
// }));



// export default useAxios;