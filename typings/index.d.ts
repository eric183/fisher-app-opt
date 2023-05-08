export {};
declare global {
  type TDemandStatus = "IDLE" | "Pending" | "Registed" | "Error" | "Matching" | "Matched";
  type LoginStatus = "authenticated" | "unauthenticated" | "pendingVerification" | "unknown";
  declare var AuthorizationToken: string;  
  declare module '@env' {
    export const API_BASE: string;
    export const WEBSOCKET_URL: string;
  }
}
