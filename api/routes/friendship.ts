import { UserProfile } from "@/models/project/UserProfile";
import client from "../client";
import { FriendshipStatus } from "@/models/resources/User";

const API_PATH = "/friendships";

export const FetchUserFriends = async (
  userId: number,
  tokenApi: string,
  page: number = 1,
  size: number = 10,
  query: string | null = null
): Promise<{
  friends: {
    user: {
      id: number;
      username: string;
      isVerified: boolean;
      profilePictureUrl: string;
    };
    acceptedAt: Date;
  }[];
  pagination: {
    page: number;
    size: number;
    total: number;
    hasMore: boolean;
  };
}> => {
  try {
    const response = await client.get(`${API_PATH}/${userId}/friends`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
      params: {
        page: page && page > 0 ? page : 1,
        size: size && size > 0 ? size : 10,
        query: query ? query : null,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const FetchIncomingFriendRequests = async (
  tokenApi: string,
  page: number = 1,
  size: number = 10,
  query: string | null = null
): Promise<{
  pendingRequests: {
    user: {
      id: number;
      username: string;
      isVerified: boolean;
      profilePictureUrl: string;
    };
    pendingAt: Date;
  }[];
  pagination: {
    page: number;
    size: number;
    total: number;
    hasMore: boolean;
  };
}> => {
  try {
    const response = await client.get(`${API_PATH}/incoming_requests`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
      params: {
        page: page && page > 0 ? page : 1,
        size: size && size > 0 ? size : 10,
        query: query ? query : null,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ShowFriendship = async (
  userId: number,
  tokenApi: string
): Promise<FriendshipStatus> => {
  try {
    const response = await client.get(`${API_PATH}/show/${userId}`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateFriendship = async (
  userId: number,
  tokenApi: string
): Promise<FriendshipStatus> => {
  try {
    const response = await client.post(
      `${API_PATH}/create/${userId}`,
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

export const AcceptFriendship = async (
  userId: number,
  tokenApi: string
): Promise<FriendshipStatus> => {
  try {
    const response = await client.post(
      `${API_PATH}/accept/${userId}`,
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

export const RejectFriendship = async (
  userId: number,
  tokenApi: string
): Promise<FriendshipStatus> => {
  try {
    const response = await client.post(
      `${API_PATH}/deny/${userId}`,
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

export const DeleteFriendship = async (
  userId: number,
  tokenApi: string
): Promise<FriendshipStatus> => {
  try {
    const response = await client.post(
      `${API_PATH}/destroy/${userId}`,
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

export const BlockUser = async (
  userId: number,
  tokenApi: string
): Promise<FriendshipStatus> => {
  try {
    const response = await client.post(
      `${API_PATH}/${userId}/block`,
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

export const UnblockUser = async (
  userId: number,
  tokenApi: string
): Promise<FriendshipStatus> => {
  try {
    const response = await client.post(
      `${API_PATH}/${userId}/unblock`,
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
