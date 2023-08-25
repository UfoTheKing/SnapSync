import { Device } from "../resources/Device";

export interface ILoginResponse {
  user: {
    id: number;
    username: string;
    profilePictureUrl: string | null;
    biography: string | null;
    isVerified: boolean;
  };
  tokenData: TokenData;
  accessToken: string; // selector:validator
  device: Device;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}
