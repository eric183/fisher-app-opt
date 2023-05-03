// var ws = React.useRef(new WebSocket('ws://w567l.sse.codesandbox.io/')).current;
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { create } from "zustand";

interface IServerToClientEvents {

}

interface IClientToServerEvents {

}

export interface ISocketState {
  ws?: Socket<IServerToClientEvents, IClientToServerEvents>;
  setWebsocket: (ws: Socket<IServerToClientEvents, IClientToServerEvents>) => void;
}

export const useWStore = create<ISocketState>()((set)=>({
   ws: undefined,
   setWebsocket: (websocketInstance) => set(()=> ({
    ws: websocketInstance
   }))
}))

const useWS = () => {
  const { ws } = useWStore();
  

  const onConnect = () => {
    console.log('hi, socket');

  }

  const onDisconnect = () => {
    console.log("off");
  }

  useEffect(() => {
    ws?.on('connect', onConnect);
    ws?.on('disconnect', onDisconnect);
    
    return () => {
      ws?.off('connect', onConnect);
      ws?.off('disconnect', onDisconnect);
    }
  }, [ws])

  return  [];
}

export default useWS;