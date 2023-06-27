import axios from "axios";
import { OpenAIResponse } from "../typings/openAI";
import { Alert } from "react-native";
import { Configuration, OpenAIApi } from "openai";

export const api_configuration = {
  apiKey: process.env.CHATGPT_PLUS_API_TOKEN,
};

export type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages?: ChatGPTMessage[];
  prompt?: string;
  temperature: number;
  top_p?: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream?: boolean;
  stop?: string[];
  user?: string;
  n: number;
}

export async function gptAPI(
  token: string,
  prompt: string
): Promise<OpenAIResponse | any> {
  const role = "user";
  const payload = {
    model: "gpt-3.5-turbo-16k-0613",
    stream: false,
    // temperature: 0.7,
    temperature: 0.1,
    max_tokens: 5000,
    // stop: "\n",
    // top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    // user: body?.user,
    n: 1,
    messages: [
      {
        role,
        content: prompt, // 4096
      },
    ],
  } as OpenAIStreamPayload;

  delete payload.prompt;

  console.log(token, "process.env.CHATGPT_PLUS_API_TOKEN");
  const res = await axios
    .post("https://api.openai.com/v1/chat/completions", payload, {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer `
        Authorization: `Bearer ${token}`,
      },
    })
    .catch((err) => {
      Alert.alert(err.response.data.message);
    });

  return res?.data;
}
