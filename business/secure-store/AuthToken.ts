import * as SecureStore from 'expo-secure-store';

export const storeAuthToken = async (token: string) => {
  await SecureStore.setItemAsync("authToken", token);
};

export const getAuthToken = async () => {
  return await SecureStore.getItemAsync("authToken");
};

export const removeAuthToken = async () => {
  await SecureStore.deleteItemAsync("authToken");
};
