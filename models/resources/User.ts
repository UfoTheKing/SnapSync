export interface User {
  id: number;
  username: string;

  dateOfBirth: {
    it: string; // DD/MM/YYYY
    en: string; // YYYY-MM-DD
  };

  biography: string | null;

  isVerified: boolean;
  isPrivate: boolean;
}

export interface FriendshipStatus {
  isFriend: boolean;

  incomingRequest: boolean;
  outgoingRequest: boolean;

  isBlocking: boolean;
}

export interface SmallUser {
  id: number;
  username: string;
  fullName: string;
  isVerified: boolean;
  profilePictureUrl: string;

  isContact?: boolean;
}
