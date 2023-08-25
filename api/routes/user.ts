import { UserProfile } from "@/models/project/UserProfile";
import client from "../client";

const API_PATH = "/users";

export const FetchUserProfileById = async (
  userId: number,
  tokenApi: string
): Promise<UserProfile> => {
  try {
    const response = await client.get(`${API_PATH}/${userId}`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
