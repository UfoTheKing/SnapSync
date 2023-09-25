import { Shape } from "@/models/project/Shape";
import client, { API_URL, ErrorResponseType } from "../client";
import * as FileSystem from "expo-file-system";

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

export const SendSnap = async (
  uri: string,
  key: string,
  tokenApi: string
): Promise<{
  message: string;
}> => {
  try {
    const response = await FileSystem.uploadAsync(
      `${API_URL}${API_PATH}/${key}/take_snap`,
      uri,
      {
        fieldName: "snap",
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
          Authorization: `Bearer ${tokenApi}`,
        },
      }
    );
    if (response.status > 299) {
      let error: ErrorResponseType = JSON.parse(response.body);
      throw error;
    }

    return JSON.parse(response.body);
  } catch (error) {
    throw error;
  }
};

export const CheckSnapInstance = async (
  key: string,
  tokenApi: string
): Promise<{
  message: string;
  isJoinable: boolean;
  shape: Shape;
}> => {
  try {
    const response = await client.get(`${API_PATH}/${key}/check`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const CreateSnapInstance = async (
  userId: number,
  tokenApi: string
): Promise<{
  message: string;
  key: string;
}> => {
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
