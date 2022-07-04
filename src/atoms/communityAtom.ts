import { CommunitySnippet } from "./../models/User/CommunitySnippet";
import { atom } from "recoil";
import { Community } from "../models/Community";

interface CommunityAtom {
  communitySnippets: CommunitySnippet[];
  currentCommunity?: Community;
  isSnippetsFetched?: boolean;
}

const defaultCommunityState: CommunityAtom = {
  communitySnippets: [],
  isSnippetsFetched: false,
};

export const communityState = atom<CommunityAtom>({
  key: "communityState",
  default: defaultCommunityState,
});

//////////////////////////따로관리하는게 어떤가

// export const currentCommunityState = atom<Community>({
//   key: "communityState",
// });

// export const communitySnippetsState = atom<CommunitySnippet[]>({
//   key: "communitySnippetsState",
//   default: [],
// });

// export const isSnippetsFetchedState = atom<Boolean>({
//   key: "isSnippetsFetchedState",
//   default: false,
// });
