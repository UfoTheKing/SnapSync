import { Shape } from "@/models/project/Shape";
import client from "../client";

const API_PATH = "/snaps_sync";

export const FetchSnapSyncShapes = async (
  tokenApi: string
): Promise<{
  shapes: Shape[];
}> => {
  try {
    const response = await client.get(`${API_PATH}/shapes`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CheckSnapInstance = async (
  tokenApi: string,
  key: string
): Promise<{
  message: string;
  isJoinable: boolean;
}> => {
  try {
    const response = await client.get(`${API_PATH}/${key}/check/`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const FetchSnapSyncComments = async (
  id: number,
  tokenApi: string
): Promise<any> => {
  try {
    const response = await client.get(`${API_PATH}/${id}/comments`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
