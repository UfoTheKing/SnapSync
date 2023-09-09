import client from "../client";
const API_PATH = "/comments";

export const LikeComment = async (
  id: number,
  tokenApi: string
): Promise<{
  message: string;
}> => {
  try {
    const response = await client.post(
      `${API_PATH}/like/${id}`,
      {},
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

export const UnlikeComment = async (
  id: number,
  tokenApi: string
): Promise<{
  message: string;
}> => {
  try {
    const response = await client.post(
      `${API_PATH}/unlike/${id}`,
      {},
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
