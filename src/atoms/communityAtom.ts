import { atom } from "recoil";
import { Community } from "../models/Community";
import { CommunitySnippet } from "../models/User/CommunitySnippet";

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
