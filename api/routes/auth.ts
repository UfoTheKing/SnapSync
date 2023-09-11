import client, { API_URL, ErrorResponseType } from "../client";
import { ILoginResponse } from "@/models/auth/Auth";
import { getDeviceUuid } from "@/business/secure-store/DeviceUuid";
import * as FileSystem from "expo-file-system";
import { Country } from "@/models/resources/Country";

const API_PATH = "/auth";

export const AuthGetSessionId = async (): Promise<{
  sessionId: string;
  message: string;
}> => {
  try {
    const { data } = await client.get(`${API_PATH}/get_session_id`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthGetCountryFromIp = async (): Promise<{
  country: Country | null;
  message: string;
}> => {
  try {
    const { data } = await client.get(`${API_PATH}/get_country_from_ip`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthValidateFullName = async (
  fullname: string,
  sessionId: string
): Promise<{
  message: string;
}> => {
  try {
    const { data } = await client.post(`${API_PATH}/fullname`, {
      fullname,
      sessionId,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthValidateDateOfBirth = async (
  yearOfBirth: number,
  monthOfBirth: number,
  dayOfBirth: number,
  sessionId: string
): Promise<{
  message: string;
}> => {
  try {
    const { data } = await client.post(`${API_PATH}/date_of_birth`, {
      yearOfBirth,
      monthOfBirth,
      dayOfBirth,
      sessionId,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthValidatePhoneNumber = async (
  phoneNumber: string,
  sessionId: string
): Promise<{
  message: string;
}> => {
  try {
    const { data } = await client.post(`${API_PATH}/phone_number`, {
      phoneNumber,
      sessionId,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthValidateOtp = async (
  otp: string,
  sessionId: string
): Promise<{
  message: string;
  goNext: boolean;
  data?: ILoginResponse;
}> => {
  const deviceUuid = await getDeviceUuid();

  try {
    const { data } = await client.post(
      `${API_PATH}/otp`,
      {
        otp,
        sessionId,
      },
      {
        headers: {
          DeviceUuid: deviceUuid,
        },
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthResendOtp = async (
  sessionId: string
): Promise<{
  message: string;
}> => {
  try {
    const { data } = await client.post(`${API_PATH}/resend_otp`, {
      sessionId,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthValidateUsername = async (
  username: string,
  sessionId: string
): Promise<{
  message: string;
}> => {
  try {
    const { data } = await client.post(`${API_PATH}/username`, {
      username,
      sessionId,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const AuthSignUp = async (
  uri: string,
  sessionId: string
): Promise<ILoginResponse> => {
  const deviceUuid = await getDeviceUuid();

  try {
    const response = await FileSystem.uploadAsync(
      `${API_URL}${API_PATH}/signup`,
      uri,
      {
        fieldName: "avatar",
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        headers: {
          DeviceUuid: deviceUuid ? deviceUuid : "",
        },
        parameters: {
          sessionId,
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

export const AuthLogInAuthToken = async (
  authToken: string
): Promise<ILoginResponse> => {
  try {
    const deviceUuid = await getDeviceUuid();

    const { data: response } = await client.post(
      `${API_PATH}/login_auth_token`,
      {
        authToken,
      },
      {
        headers: {
          DeviceUuid: deviceUuid,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const AuthLogOut = async (
  tokenApi: string
): Promise<{
  message: string;
}> => {
  const deviceUuid = await getDeviceUuid();

  try {
    const { data } = await client.post(
      `${API_PATH}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${tokenApi}`,
          DeviceUuid: deviceUuid,
        },
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};
