import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useResetRecoilState } from "recoil";
import { communitySnippetsState,isSnippetFetchedState } from "../../atoms/communityAtom";
import { postVotesState, savedPostIdsState, sharedPostIdsState } from "../../atoms/postAtom";
import { auth } from "../../firebase/clientApp";
import useCommunity from "../../hooks/useCommunity";
import usePost from "../../hooks/usePost";
import Header from "../Header/Header";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const { communityId } = useRouter().query;
  const [user] = useAuthState(auth);
  const { getSavedPostIds, getSharedPostIds } = usePost();
  const { getCommunitySnippets, getCommunity } = useCommunity();

  const resetPostVotes = useResetRecoilState(postVotesState);
  const resetSavedPostIds = useResetRecoilState(savedPostIdsState);
  const resetSharedPostIds = useResetRecoilState(sharedPostIdsState);
  const resetCommunitySnippets = useResetRecoilState(communitySnippetsState);
  const resetIsSnipeptFetched = useResetRecoilState(isSnippetFetchedState);

  useEffect(() => {
    //유저 없으면 Clear recoilState
    if (!user) {
      resetCommunitySnippets();
      resetIsSnipeptFetched();
      resetPostVotes();
      resetSavedPostIds();
      resetSharedPostIds();
      return;
    }

    getCommunitySnippets();
    getSavedPostIds();
    getSharedPostIds();
  }, [user]);

  useEffect(() => {
    if (communityId) getCommunity(communityId as string);
  }, [communityId]);

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
