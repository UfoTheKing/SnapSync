export interface SnapSyncData {
  id: number;
  key: string;
  title: string;
  users: SnapSyncUser[];
  timer: SnapSyncTimer;
  shape: SnapSyncShape;
}

export interface SnapSyncUser {
  id: number;
  username: string;
  profilePictureUrl: string;
  position: string;
  isJoined: boolean;

  imageUrl?: string;
}

export interface SnapSyncTimer {
  start: boolean;
  seconds: number;
  minutes: number;
}

export interface SnapSyncShape {
  id: number;
  name: string;
}

export interface DeleteAndLeaveSnapSyncData {
  key: string;
  exit: boolean;
}
