import { Rules } from "@/models/project/Rules";
import client from "../client";
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
