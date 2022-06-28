import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

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

export type PostVote = {
  id?: string;
  postId: string;
  communityId: string;
  vote: 1 | -1;
};

interface PostItems {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[],
}

const defaultPostState: PostItems = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const postState = atom<PostItems>({
  key: "postState",
  default: defaultPostState,
});
