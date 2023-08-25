import { ExpoPushToken } from "expo-notifications";
import client from "../client";
import { CreateStoryReaction } from "@/models/dto/Stories";
import { getDeviceUuid } from "@/business/secure-store/DeviceUuid";

const API_PATH = "/notifications";

export const SendExpoPushToken = async (
  token: ExpoPushToken,
  tokenApi: string
): Promise<{
  message: string;
}> => {
  const deviceUuid = await getDeviceUuid();
  try {
    const response = await client.post(
      `${API_PATH}/expo-push-token`,
      {
        token: token.data,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenApi}`,
          DeviceUuid: deviceUuid,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
