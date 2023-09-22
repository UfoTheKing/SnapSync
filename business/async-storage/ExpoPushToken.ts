import AsyncStorage from "@react-native-async-storage/async-storage";

export const AsyncStorageStoreExpoPushToken = async (
  token: string
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem("@expoPushToken", token);

    return true;
  } catch (e) {
    // saving error

    return false;
  }
};

export const AsyncStorageGetExpoPushToken = async (): Promise<
  string | null
> => {
  try {
    const value = await AsyncStorage.getItem("@expoPushToken");
    return value;
  } catch (e) {
    // error reading value
    return null;
  }
};

export const AsyncStorageRemoveExpoPushToken = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem("@expoPushToken");

    return true;
  } catch (e) {
    // error reading value

    return false;
  }
};
