import { Timestamp } from "firebase/firestore";

type PostItem = {
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
  vote?: 1 | -1;
}