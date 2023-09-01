import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ILoginResponse } from "@/models/auth/Auth";
import {
  getAuthToken,
  removeAuthToken,
  storeAuthToken,
} from "@/business/secure-store/AuthToken";
import { AuthLogInAuthToken } from "@/api/routes/auth";
import { storeDeviceUuid } from "@/business/secure-store/DeviceUuid";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [data, setData] = useState<ILoginResponse | undefined>(undefined);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        const authToken = await getAuthToken();
        if (authToken) {
          try {
            const data = await AuthLogInAuthToken(authToken);
            if (data) {
              setData(data);
              console.log("Vecchio access token: ", authToken);
              console.log("Nuovo access token: ", data.accessToken);

              await storeAuthToken(data.accessToken);
              await storeDeviceUuid(data.device.uuid);
            }
          } catch (e) {
            await removeAuthToken();
          }
        }

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return {
    isLoadingComplete: isLoadingComplete,
    data: data,
  };
}
