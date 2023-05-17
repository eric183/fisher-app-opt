// var ws = React.useRef(new WebSocket('ws://w567l.sse.codesandbox.io/')).current;
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { create } from "zustand";
import useCommonStore from "../store/common";
import { useAxios } from "../store/axios";
import useRequest from "./request";
import { TUser } from "../store/user";

interface IChatInfo {
  fromUserId: string;
  toUserId: string;
  message: string;
  demandId?: string;
  type: "normal" | "demand";
}
interface IServerToClientEvents {
  startChat: (arg: IChatInfo) => void;
}

interface IClientToServerEvents {
  startChat: (arg: IChatInfo) => void;
  joinChat: (arg: Omit<IChatInfo, "message">) => void;
}

export interface ISocketState {
  ws?: Socket<IServerToClientEvents, IClientToServerEvents>;
  setWebsocket: (
    ws: Socket<IServerToClientEvents, IClientToServerEvents>
  ) => void;
}

export const useWStore = create<ISocketState>()((set) => ({
  ws: undefined,
  setWebsocket: (websocketInstance) =>
    set(() => ({
      ws: websocketInstance,
    })),
}));

const useWS = () => {
  const { ws } = useWStore();
  const router = useRouter();
  const { getUser } = useRequest();
  const { setUsersWithChats } = useCommonStore();
  const requestUsersWithChats = useCommonStore(
    (state) => state.requestUsersWithChats
  );
  const onConnect = () => {
    console.log("hi, socket");
  };

  const onDisconnect = () => {
    console.log("off");
  };

  const startChat = async (data: IChatInfo) => {
    console.log("coming", data);

    const _finder = requestUsersWithChats.some(
      (c) => c.user.id === data.fromUserId && c.user.id === data.fromUserId
    );

    // router.push("/chat");

    // useAxios().instance?.get("/");

    if (!_finder) {
      const user = (await getUser(data.fromUserId)) as unknown as TUser;

      setUsersWithChats({
        user,
        message: data.message,
        demandId: data.demandId as string,
        type: data.type,
      });
    }
  };

  useEffect(() => {
    ws?.on("connect", onConnect);
    ws?.on("disconnect", onDisconnect);
    ws?.on("startChat", startChat);

    return () => {
      ws?.off("connect", onConnect);
      ws?.off("disconnect", onDisconnect);
      ws?.off("startChat", startChat);
    };
  }, [ws, startChat]);

  return [ws];
};

export default useWS;
