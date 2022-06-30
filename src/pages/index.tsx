import type { NextPage } from "next";
import HomeFeed from "../components/Feed/HomeFeed";
import ContentLayout from "../components/Layout/ContentLayout";
import CreatePostLink from "../components/Post/CreatePostLink";
import TopCommunities from "../components/Widget/TopCommunities";

const Home: NextPage = () => {
  return (
    <ContentLayout>
      {/* Left */}
      <>
        <CreatePostLink />
        <HomeFeed />
      </>

      {/* Right */}
      <TopCommunities />
    </ContentLayout>
  );
};

export default Home;
