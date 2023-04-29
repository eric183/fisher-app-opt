import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { omit } from "lodash";



const request = async(url: string, data?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {

    const response = await axios({
      url,
      method: data?.method ? data.method : "GET",
      data: omit(data, ["method"]) 
    })
    return response;
  } catch(error) {
    console.log(error);
    
    return new Promise(()=> error); 

  }
}

export default request;