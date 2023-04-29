import axios from "axios";
import { OpenAIResponse } from "../typings";

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

export async function gptAPI(prompt: string): Promise<OpenAIResponse> {
      
  const role = "user";
  const payload = {
      model: "gpt-3.5-turbo",
      stream: false,
      temperature: 0.7,
      max_tokens: 1500,
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
  const res = await axios.post("https://api.openai.com/v1/chat/completions", payload, {
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer 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`
      // 'Authorization': `Bearer ${api_configuration.apiKey}`
    }
  })
  console.log(res,'!!!');
  return res.data;
}