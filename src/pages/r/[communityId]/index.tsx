import React from "react";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communityAtom";
import CommunityBanner from "../../../components/Community/CommunityBanner";
import NotFound from "../../../components/Community/NotFound";
import CommunityFeed from "../../../components/Feed/CommunityFeed";
import ContentLayout from "../../../components/Layout/ContentLayout";
import CreatePostWidget from "../../../components/Widget/TopWidget/CreatePostWidget";
import BackToTop from "../../../components/Widget/SideWidget/BackToTop";
import AboutCommunity from "../../../components/Widget/SideWidget/AboutCommunity";

const CommunityPage: React.FC = () => {
  const community = useRecoilValue(communityState);

  if (!community) return <NotFound />;
  return (
    <>
      <CommunityBanner community={community} />

      <ContentLayout>
        {/* Left */}
        <>
          <CreatePostWidget />
          <CommunityFeed/>
        </>

        {/* Right */}
        <>
          <AboutCommunity community={community} />
          <BackToTop />
        </>
      </ContentLayout>
    </>
  );
};
export default CommunityPage;
