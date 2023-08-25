import { Feed } from "@/models/project/Feed";
import client from "../client";

const API_PATH = "/feed";

export const FetchTimeline = async (
  tokenApi: string,
  count?: number,
  page?: number
): Promise<{
  train: Array<Feed>;
}> => {
  try {
    let url = `${API_PATH}/timeline`;

    if (page && page > 0) {
      url += `?page=${page}`;
    }

    const response = await client.get(url, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
