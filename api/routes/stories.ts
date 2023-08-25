import client from "../client";
import { CreateStoryReaction } from "@/models/dto/Stories";

const API_PATH = "/stories";

export const GetStoryReactions = async (
  tokenApi: string,
  storyId: number,
  emojiKey?: string,
  page?: number
): Promise<{
  header?: {
    [key: string]: {
      emoji: string;
      count: number;
    };
  };
  reactions: Array<{
    user: {
      id: number;
      username: string;
      isVerified: boolean;
      profilePictureUrl: string;
    };
    reaction: {
      emoji: string;
      key: string;
    };
  }>;
  pagination: {
    total: number;
    size: number;
    page: number;
    hasMore: boolean;
  };
}> => {
  try {
    let url = `${API_PATH}/interactions/get_story_reactions`;

    if (page && page > 0) url += `?page=${page}`;

    const response = await client.post(
      url,
      {
        storyId,
        emojiKey,
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

export const SendStoryReaction = async (
  tokenApi: string,
  data: CreateStoryReaction
): Promise<{
  message: string;
}> => {
  try {
    let url = `${API_PATH}/interactions/send_story_reaction`;

    const response = await client.post(url, data, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
