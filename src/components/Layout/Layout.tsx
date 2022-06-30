import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { communityState } from "../../atoms/communityAtom";
import { postState } from "../../atoms/postAtom";
import { auth } from "../../firebase/clientApp";
import useCommunity from "../../hooks/useCommunity";
import Header from "../Header/Header";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const { communityId } = useRouter().query;
  const [user] = useAuthState(auth);
  const setPostAtom = useSetRecoilState(postState);
  const setCommunityAtom = useSetRecoilState(communityState);
  const { getCommunitySnippets, getCommunity } = useCommunity();

  useEffect(() => {
    //유저 없으면 Clear recoilState
    if (!user) {
      setCommunityAtom((prev) => ({
        ...prev,
        communitySnippets: [],
        isSnippetsFetched: false,
      }));
      setPostAtom((prev) => ({
        ...prev,
        postVotes: [],
      }));

      return;
    }

    getCommunitySnippets();
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
