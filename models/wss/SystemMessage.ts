export interface SystemMessage {
  success: boolean;
  message: string;
  action: string | null;
  data: any | null;
  isBroadcast: boolean;
  sender: string;
}
