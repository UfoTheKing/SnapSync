import axios from "axios";

const IP = "10.167.12.85";
export const API_URL = `http://${IP}:8000`;
export const WSS_URL = `ws://${IP}:8999`;

export interface ErrorResponseType {
  message: string;
  statusCode: number;
  data?: any;
}

export interface Pagination {
  pageSize: number;
  pageNumber: number;
  total: number;
}

export function instanceOfErrorResponseType(
  object: any
): object is ErrorResponseType {
  return "message" in object && "statusCode" in object;
}

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleError(error));
  }
);

const handleError = (error: unknown) => {
  // console.log(error);
  var message = "An unexpected error occurred.";
  var statusCode = 500;
  var data = undefined;

  if (axios.isAxiosError(error)) {
    message = error.response?.data.message || "An unexpected error occurred.";
    statusCode = error.response?.data.statusCode
      ? error.response?.data.statusCode
      : error.response?.status
      ? error.response?.status
      : 500;
    data = error.response?.data.data ? error.response?.data.data : undefined;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const object: ErrorResponseType = {
    message,
    statusCode,
    data,
  };

  return object;
};

export default client;
