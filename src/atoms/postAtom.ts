import { atom } from "recoil";
import { Post } from "../models/Post";
import { PostVote } from "../models/User/PostVote";

export const postState = atom<Post | null>({
  key: "postState",
  default: null,
});

export const postsState = atom<Post[]>({
  key: "postsState",
  default: [],
});

export const postVotesState = atom<PostVote[]>({
  key: "postVotesState",
  default: [],
});


export const savedPostIdsState = atom<String[]>({
  key: "savedPostIdsState",
  default: [],
});

export const sharedPostIdsState = atom<String[]>({
  key: "sharedPostIdsState",
  default: [],
});

