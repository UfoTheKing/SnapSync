import client from "../client";
import { UserLocation } from "@/models/resources/UserLocation";

const API_PATH = "/locations";

export const FetchLastUserLocation = async (
  tokenApi: string
): Promise<{
  message: string;
  location: UserLocation | null;
}> => {
  try {
    const response = await client.get(`${API_PATH}/last_location`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
