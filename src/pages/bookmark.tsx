import BookmarkFeed from "../components/Feed/BookmarkFeed";
import ContentLayout from "../components/Layout/ContentLayout";
import BackToTop from "../components/Widget/SideWidget/BackToTop";
import TopCommunities from "../components/Widget/SideWidget/TopCommunities";

type Props = {};

const bookmark: React.FC<Props> = () => {
  
  return (
    <ContentLayout>
      {/* Left */}
      <>
        <BookmarkFeed />
      </>

      {/* Right */}
      <>
        <TopCommunities />
        <BackToTop />
      </>
    </ContentLayout>
  );
};
export default bookmark;
