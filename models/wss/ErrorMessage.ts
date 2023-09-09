export interface ErrorMessage {
  success: boolean;
  message: string;
  action: string | null;
  data: any | null;
  code: number;
  isBroadcast: boolean;
  sender: string;
}
