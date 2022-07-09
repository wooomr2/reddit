import type { NextPage } from "next";
import HomeFeed from "../components/Feed/HomeFeed";
import ContentLayout from "../components/Layout/ContentLayout";
import BackToTop from "../components/Widget/SideWidget/BackToTop";
import TopCommunities from "../components/Widget/SideWidget/TopCommunities";
import SortWidget from "../components/Widget/TopWidget/SortWidget";

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

// export async function getServerSideProps(context: GetServerSidePropsContext) {

//   try {
//     console.log("서버사이드프롭스");
//     const q = query(
//       collection(firestore, "posts"),
//       orderBy("totalVote", "desc"),
//       limit(1)
//     );
//     const postDocs = await getDocs(q);
//     const ssrPosts = postDocs.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return {
//       props: {
//         ssrPosts: JSON.parse(
//           safeJsonStringify(ssrPosts)
//         )
//       },
//     };
//   } catch (error) {
//     console.log("getServerSideProps error - [HomeFeed]", error);
//   }
// }
