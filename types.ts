import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthDto } from "@/models/dto/Auth";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { SnapShapePosition } from "./models/resources/SnapShapePosition";
import { Shape } from "./models/project/Shape";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
/* ------------------------------------------------------ ROOT ------------------------------------------------------ */
export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  UserProfileStack:
    | NavigatorScreenParams<UserProfileStackParamList>
    | undefined;

  SnapSyncStack: NavigatorScreenParams<SnapSyncStackParamList> | undefined;
  EditProfileStack:
    | NavigatorScreenParams<EditProfileStackParamList>
    | undefined;
  UserSettingsStack:
    | NavigatorScreenParams<UserSettingsStackParamList>
    | undefined;

  // Not Logged
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/* ------------------------------------------------------ Auth ------------------------------------------------------ */
/**
 * Flusso Auth:
 * 1. L'utente inserisce il FullName
 * 2. L'utente inserisce la data di nascita
 *  - Se la data di nascita è valida, l'utente viene reindirizzato alla schermata di inserimento del numero di telefono
 *  - Se la data di nascita non è valida, l'utente viene reindirizzato alla schermata di inserimento della data di nascita
 * 3. L'utente inserisce il numero di telefono
 *  - Se il numero di telefono è valido, l'utente viene reindirizzato alla schermata di verifica dell'OTP
 *  - Se il numero di telefono non è valido, l'utente viene reindirizzato alla schermata di inserimento del numero di telefono
 * 4. L'utente inserisce il codice di verifica del numero di telefono
 *  - Se il codice di verifica è valido, il backend, se il numero di telefono esiste già,
 *    allora l'utente viene reindirizzato alla schermata Home, altrimenti l'utente viene reindirizzato alla schermata di inserimento dello username
 *  - Se il codice di verifica non è valido, l'utente viene reindirizzato alla schermata di verifica dell'OTP
 */

export type AuthStackParamList = {
  AuthInsertFullName: {
    userData: AuthDto;
  };

  AuthInsertDateOfBirth: {
    userData: AuthDto;
  };
  AuthInsertPhoneNumber: {
    userData: AuthDto;
  };
  AuthInsertOtp: {
    userData: AuthDto;
  };
  AuthInsertUsername: {
    userData: AuthDto;
  };
  AuthChooseProfilePicture: {
    userData: AuthDto;
  };
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ BOTTOM TABS ------------------------------------------------------ */
export type RootTabParamList = {
  TabHomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  TabSearchStack: NavigatorScreenParams<SearchStackParamList> | undefined;
  TabUserProfileStack:
    | NavigatorScreenParams<UserProfileStackParamList>
    | undefined;
};
export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    MaterialTopTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ HOME ------------------------------------------------------ */
export type HomeStackParamList = {
  Home: undefined;
};

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

/* ------------------------------------------------------ FRIENDS AND SEARCH ------------------------------------------------------ */
export type SearchStackParamList = {
  Search: undefined;
  OutgoingRequests: undefined;
};

export type SearchStackScreenProps<Screen extends keyof SearchStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<SearchStackParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
/* ------------------------------------------------------ USER ------------------------------------------------------ */
export type UserProfileStackParamList = {
  UserProfile: {
    fromHome: boolean;

    userId: number;

    username?: string;
    profilePictureUrl?: string;
  };

  MutualFriends: {
    userId: number;
    username: string;
    isVerified: boolean;
  };
};

export type UserProfileStackScreenProps<
  Screen extends keyof UserProfileStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<UserProfileStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
/* ------------------------------------------------------ SNAPSYNC ------------------------------------------------------ */
export type SnapSyncStackParamList = {
  SnapSync: {
    mode: "create" | "join";
    key?: string;
  };
  TakeSnap: {
    key: string;
  };
  PublishSnap: {
    key: string;
    image: string;
    shape: Shape;
  };
};

export type SnapSyncStackScreenProps<
  Screen extends keyof SnapSyncStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<SnapSyncStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

/* ------------------------------------------------------ EDIT PROFILE ------------------------------------------------------ */
export type EditProfileStackParamList = {
  EditProfile: undefined;
  EditProfileUsername: {
    username: string;
  };
  EditProfileFullName: {
    fullName: string;
  };
  EditProfileBio: {
    biography: string | null;
  };

  EditProfileProfilePictureTakePhoto: undefined;
};

export type EditProfileStackScreenProps<
  Screen extends keyof EditProfileStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<EditProfileStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

/* ------------------------------------------------------ USER SETTINGS ------------------------------------------------------ */
export type UserSettingsStackParamList = {
  UserSettings: undefined;

  // Security
  UserSettingsDevices: undefined;

  // Privacy
  UserSettingsBlockedUsers: undefined;

  // About
  UserSettingsAbout: undefined;
};

export type UserSettingsStackScreenProps<
  Screen extends keyof UserSettingsStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<UserSettingsStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
