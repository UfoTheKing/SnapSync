export interface MutualFriends {
  count: number;
  nodes: Array<{
    id: number;
    username: string;
    fullName: string | null;
    isVerified: boolean;
    profilePictureUrl: string;
  }>;
}

export interface Biography {
  rawText: string | null;
  entities?: Array<BiographyEntity>;
}

export interface BiographyEntity {
  type: "user";
  id: number;
  text: string;
}

export interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  isVerified: boolean;
  profilePictureUrl: string;

  biography: Biography | null;

  mutualFriends?: MutualFriends;

  friendsCount: number;
  snapsCount: number;

  isMyProfile: boolean;
  isPrivate: boolean;
}
