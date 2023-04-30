export {};
declare global {
  type TDemandStatus = "IDLE" | "Pending" | "Registed" | "Error" | "Matching" | "Matched";
  type LoginStatus = "authenticated" | "unauthenticated" | "pendingVerification" | "unknown";
  declare var AuthorizationToken: string;  
}

