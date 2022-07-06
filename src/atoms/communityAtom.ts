import { atom } from "recoil";
import { Community } from "../models/Community";
import { CommunitySnippet } from "./../models/User/CommunitySnippet";

export const communityState = atom<Community | null>({
  key: "communityState",
  default: null,
});

export const communitySnippetsState = atom<CommunitySnippet[]>({
  key: "communitySnippetsState",
  default: [],
});

export const isSnippetFetchedState = atom<Boolean>({
  key: "isSnippetFetchedState",
  default: false,
});
