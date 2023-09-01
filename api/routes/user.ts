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

export const CreateUserContacts = async (
  phoneNumbers: string[],
  tokenApi: string
): Promise<{
  message: string;
}> => {
  try {
    const response = await client.post(
      `${API_PATH}/contacts`,
      {
        phoneNumbers,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenApi}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
