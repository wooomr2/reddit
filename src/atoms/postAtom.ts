import { atom } from "recoil";
import { Post } from "../models/Post";
import { PostVote } from "../models/User/PostVote";

interface PostAtom {
  selectedPost: Post | null;
  selectedPostVote: PostVote | null;
  posts: Post[];
  postVotes: PostVote[];
}

const defaultPostState: PostAtom = {
  selectedPost: null,
  selectedPostVote: null,
  posts: [],
  postVotes: [],
};

export const postState = atom<PostAtom>({
  key: "postState",
  default: defaultPostState,
});