import { Shape } from "@/models/project/Shape";
import client from "../client";
import { SmallUser } from "@/models/resources/User";

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
