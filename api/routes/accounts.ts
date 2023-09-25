import { Rules } from "@/models/project/Rules";
import client, { API_URL, ErrorResponseType } from "../client";
import * as FileSystem from "expo-file-system";
import { SmallUser } from "@/models/resources/User";

const API_PATH = "/accounts";

export const FetchWebFormData = async (
  tokenApi: string
): Promise<{
  formData: {
    username: string;
    fullName: string;
    phoneNumber: string;
    biography: string | null;
  };
}> => {
  try {
    const response = await client.get(`${API_PATH}/edit/web_form_data`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const FetchSettingsWebInfo = async (
  tokenApi: string
): Promise<{
  webInfo: {
    privateAccount: boolean;
  };
  message: string;
}> => {
  try {
    const response = await client.get(`${API_PATH}/settings/web_info`, {
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const FetchUsernameRules = async (): Promise<{
  field: string;
  rules: Rules;
}> => {
  try {
    const response = await client.get(`${API_PATH}/username/rules`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const FetchFullNameRules = async (): Promise<{
  field: string;
  rules: Rules;
}> => {
  try {
    const response = await client.get(`${API_PATH}/full_name/rules`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const FetchBioRules = async (): Promise<{
  field: string;
  rules: Rules;
}> => {
  try {
    const response = await client.get(`${API_PATH}/bio/rules`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ChangeUsername = async (
  username: string,
  tokenApi: string
): Promise<{
  message: string;
  username: string;
}> => {
  try {
    const response = await client.put(
      `${API_PATH}/edit/username`,
      {
        username,
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

export const ChangeFullName = async (
  fullName: string,
  tokenApi: string
): Promise<{
  message: string;
  fullName: string;
}> => {
  try {
    const response = await client.put(
      `${API_PATH}/edit/full_name`,
      {
        fullName,
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

export const ChangeBio = async (
  bio: string | null,
  tokenApi: string
): Promise<{
  message: string;
  biography: string | null;
}> => {
  try {
    const response = await client.put(
      `${API_PATH}/edit/bio`,
      {
        biography: bio,
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

export const ChangeProfilePicture = async (
  fileUri: string,
  tokenApi: string
): Promise<{
  message: string;
  profilePictureUrl: string;
}> => {
  try {
    let url = `${API_URL}${API_PATH}/web_change_profile_pic`;
    const response = await FileSystem.uploadAsync(url, fileUri, {
      fieldName: "avatar",
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      headers: {
        Authorization: `Bearer ${tokenApi}`,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      let error: ErrorResponseType = JSON.parse(response.body);
      throw error;
    }

    return JSON.parse(response.body);
  } catch (error) {
    throw error;
  }
};

export const SetIsPrivate = async (
  isPrivate: boolean,
  tokenApi: string
): Promise<{
  message: string;
}> => {
  try {
    const response = await client.put(
      `${API_PATH}/set_private`,
      {
        isPrivate,
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

export const FetchBlockedUsers = async (
  tokenApi: string,
  page: number = 1,
  size: number = 10
): Promise<{
  users: Array<SmallUser>;
  pagination: {
    page: number;
    size: number;
    total: number;
    hasMore: boolean;
  };
}> => {
  try {
    const response = await client.get(
      `${API_PATH}/settings/privacy/blocked_accounts`,
      {
        headers: {
          Authorization: `Bearer ${tokenApi}`,
        },
        params: {
          page: page && page > 0 ? page : 1,
          size: size && size > 0 ? size : 10,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
