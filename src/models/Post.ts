import { Timestamp } from "firebase/firestore";

export type Post = {
  id: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  totalVote: number;
  imageURLs?: string[];
  communityImageURL?: string;
  createdAt: Timestamp;
};