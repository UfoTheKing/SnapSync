import { FeedChildComment, FeedComment } from "@/models/project/Feed";

export function createWssMessage(
  action: string,

  token?: string,
  deviceUuid?: string,
  data?: any
) {
  let t = `Bearer ${token}`;

  let message: any = {
    action: action,
  };

  if (deviceUuid) {
    message["deviceUuid"] = deviceUuid;
  }

  if (data) {
    message["data"] = data;
  }

  if (token) message["token"] = t;

  return JSON.stringify(message);
}

export function instanceOfFeedChildComment(
  object: any
): object is FeedChildComment {
  return "parentCommentId" in object;
}

export function instanceOfFeedComment(object: any): object is FeedComment {
  return "childCommentsCount" in object;
}
