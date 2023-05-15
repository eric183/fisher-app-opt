export {};
declare global {
  type TDemandStatus =
    | "IDLE"
    | "Pending"
    | "Registed"
    | "Error"
    | "Matching"
    | "Matched";
  type LoginStatus =
    | "authenticated"
    | "unauthenticated"
    | "pendingVerification"
    | "unknown";
  declare let AuthorizationToken = "";
  declare namespace NodeJS {
    interface ProcessEnv {
      API_BASE: string;
      WEBSOCKET_URL: string;
    }
  }
}
