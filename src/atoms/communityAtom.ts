import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt: Timestamp;
  imageURL?: string;
}

export interface CommunitySnippet {
  communityId?: string;
  isModerator?: boolean;
  imageURL?: string;
}

interface MySnippets {
  communitySnippets: CommunitySnippet[];
  currentCommunity?: Community;
  isSnippetsFetched?: boolean;
}

const defaultCommunityState: MySnippets = {
  communitySnippets: [],
  isSnippetsFetched: false,
};

export const communityState = atom<MySnippets>({
  key: "communityState",
  default: defaultCommunityState,
});
