import { atom } from "recoil";
import { Post } from "../models/Post";
import { PostVote } from "../models/User/PostVote";

interface PostAtom {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
}

const defaultPostState: PostAtom = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const postState = atom<PostAtom>({
  key: "postState",
  default: defaultPostState,
});

///////////////////////////////////////////////////

// export const selectedPostState = atom<Post | null>({
//   key: "selectedPostState",
//   default: null,
// });

// export const postsState = atom<Post[]>({
//   key: "postState",
//   default: [],
// });

// export const postVotesState = atom<PostVote[]>({
//   key: "postState",
//   default: [],
// });
