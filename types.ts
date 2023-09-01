import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthDto } from "@/models/dto/Auth";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

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

  // Not Logged
  Onboarding: undefined;
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

/* ------------------------------------------------------ Auth ------------------------------------------------------ */
/**
 * Flusso Auth:
 * 1. L'utente inserisce lo username
 *    - Se lo username è già presente nel database, l'utente viene reindirizzato alla schermata di verifica dell'OTP
 *   - Se lo username non è presente nel database, l'utente viene reindirizzato alla schermata di inserimento della data di nascita
 * 2. L'utente inserisce la data di nascita
 *   - Se la data di nascita è valida, l'utente viene reindirizzato alla schermata di inserimento del numero di telefono
 *  - Se la data di nascita non è valida, l'utente viene reindirizzato alla schermata di inserimento della data di nascita
 * 3. L'utente inserisce il numero di telefono
 *  - Se il numero di telefono è valido, l'utente viene reindirizzato alla schermata di verifica dell'OTP
 * - Se il numero di telefono non è valido, l'utente viene reindirizzato alla schermata di inserimento del numero di telefono
 * 4. L'utente inserisce il codice di verifica del numero di telefono
 * - Se il codice di verifica è valido, l'utente viene reindirizzato alla schermata di Home: il backend (se il numero di telefono non è presente nel database) crea l'utente e lo reindirizza alla schermata di Home
 * - Se il codice di verifica non è valido, l'utente viene reindirizzato alla schermata di verifica dell'OTP
 *
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
    subtitle: string;
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
};

export type UserProfileStackScreenProps<
  Screen extends keyof UserProfileStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<UserProfileStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
/* ------------------------------------------------------ SNAPSYNC ------------------------------------------------------ */
export type SnapSyncStackParamList = {
  Create: {
    createdByMe: boolean;
  };
  Invite: {
    position: string;
  };
};

export type SnapSyncStackScreenProps<
  Screen extends keyof SnapSyncStackParamList
> = CompositeScreenProps<
  NativeStackScreenProps<SnapSyncStackParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
