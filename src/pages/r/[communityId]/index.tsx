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
  const community = useRecoilValue(communityState).currentCommunity;

  if (!community) return <NotFound />;
  return (
    <>
      <CommunityBanner community={community} />

      <ContentLayout>
        {/* Left */}
        <>
          <CreatePostLink />
          <CommunityFeed community={community} />
        </>

        {/* Right */}
        <AboutCommunity community={community} />
      </ContentLayout>
    </>
  );
};
export default CommunityPage;
