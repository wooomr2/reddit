import type { NextPage } from "next";
import HomeFeed from "../components/Feed/HomeFeed";
import ContentLayout from "../components/Layout/ContentLayout";
import SortWidget from "../components/Widget/TopWidget/SortWidget";
import TopCommunities from "../components/Widget/SideWidget/TopCommunities";
import BackToTop from "../components/Widget/SideWidget/BackToTop";

const Home: NextPage = () => {
  
  return (
    <ContentLayout>
      {/* Left */}
      <>
        <SortWidget />
        <HomeFeed />
      </>

      {/* Right */}
      <>
      <TopCommunities />
      <BackToTop />
      </>
    </ContentLayout>
  );
};

export default Home;
