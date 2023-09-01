import client from "../client";
import { SmallUser } from "@/models/resources/User";

const API_PATH = "/searches";

export const SearchByQuery = async (
  query: string,
  tokenApi: string
): Promise<{
  [key: string]: {
    title: string;
    showAcceptButton?: boolean;
    showAddButton?: boolean;
    showRemoveButton?: boolean;
    users: SmallUser[];
  };
}> => {
  try {
    const response = await client.get(`${API_PATH}?query=${query}`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
