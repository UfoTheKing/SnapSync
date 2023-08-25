import * as SecureStore from 'expo-secure-store';

export const storeDeviceUuid = async (uuid: string) => {
  await SecureStore.setItemAsync("deviceUuid", uuid);
};

export const getDeviceUuid = async () => {
  return await SecureStore.getItemAsync("deviceUuid");
};

export const removeDeviceUuid = async () => {
  await SecureStore.deleteItemAsync("deviceUuid");
};
