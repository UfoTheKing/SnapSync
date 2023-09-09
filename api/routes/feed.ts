import { TimelineNode } from "@/models/project/Feed";
import client from "../client";
const API_PATH = "/feed";

export const FetchTimeline = async (
  tokenApi: string
): Promise<{
  nodes: TimelineNode[];
}> => {
  try {
    const response = await client.get(`${API_PATH}/timeline`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
