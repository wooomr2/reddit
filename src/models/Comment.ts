import { Timestamp } from "firebase/firestore";

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayName: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string; //reply로고칠까
  createdAt: Timestamp;
};
