import { SmallSnapShape } from "../resources/SnapShape";
import { SnapShapePosition } from "../resources/SnapShapePosition";
import { SmallUser, User } from "../resources/User";

export interface TimelineNode {
  feed?: Feed;
}

export interface FeedComment {
  id: number;
  snapSyncId: number;
  userId: number;

  likesCount: number;
  hasLikedComment: boolean;

  childCommentsCount: number;

  text: string | null;

  user: SmallUser;

  previewChildComments?: FeedChildComment[];

  createdAt: Date;
}

export interface FeedChildComment {
  id: number;
  snapSyncId: number;
  userId: number;
  parentCommentId: number;

  childCommentIndex: number;
  likesCount: number;
  hasLikedComment: boolean;

  text: string | null;

  user: SmallUser;

  createdAt: Date;
}

export interface FeedUser {
  user: SmallUser;
  position: SnapShapePosition;
  subtitle: string;
}

export interface Feed {
  id: number;
  shape: SmallSnapShape;
  owner: User;
  users: FeedUser[];

  image: string;

  originalWidth: number;
  originalHeight: number;

  commentsCount: number;
  comments: FeedComment[];

  publishedAt: Date;
}
