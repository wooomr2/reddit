import React from "react";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communityAtom";
import CommunityBanner from "../../../components/Community/CommunityBanner";
import NotFound from "../../../components/Community/NotFound";
import CommunityFeed from "../../../components/Feed/CommunityFeed";
import ContentLayout from "../../../components/Layout/ContentLayout";
import CreatePostLink from "../../../components/Post/CreatePostLink";
import AboutCommunity from "../../../components/Widget/AboutCommunity";

const CommunityPage: React.FC = () => {
  const currentCommunity = useRecoilValue(communityState).currentCommunity;

  if (!currentCommunity) return <NotFound />;
  return (
    <>
      <CommunityBanner community={currentCommunity} />

      <ContentLayout>
        {/* Left */}
        <>
          <CreatePostLink />
          <CommunityFeed community={currentCommunity} />
        </>

        {/* Right */}
        <AboutCommunity community={currentCommunity} />
      </ContentLayout>
    </>
  );
};
export default CommunityPage;
