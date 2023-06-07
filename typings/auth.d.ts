// Generated by https://quicktype.io

export interface IAuthResponse {
  type: string;
  error: null;
  url: string;
  params: Params;
  authentication: Authentication;
  errorCode: null;
}

interface Authentication {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  scope: string;
  state: string;
  issuedAt: number;
}

interface Params {
  state: string;
  access_token: string;
  token_type: string;
  expires_in: string;
  scope: string;
  authuser: string;
  prompt: string;
  [key: string]: string;
}

// Generated by https://quicktype.io

export interface IGoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface I0Uath {
  authentication: Authentication;
  error: null;
  errorCode: null;
  params: {
    authuser: string;
    code: string;
    prompt: string;
    scope: string;
    state: string;
  };
  type: string;
  url: string;
}
