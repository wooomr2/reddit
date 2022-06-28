import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { Community, communityState } from "../../../atoms/communityAtom";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import NotFound from "../../../components/Community/NotFound";
import Header from "../../../components/Community/Header";
import PageContent from "../../../components/Layout/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Posts from "../../../components/Post/Posts";
import { useRecoilState } from "recoil";
import About from "../../../components/Community/About";

type CommunityPageProps = {
  community: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ community }) => {
  const [mySnippets, setMySnippets] = useRecoilState(communityState);

  useEffect(() => {
    setMySnippets((prev) => ({
      ...prev,
      currentCommunity: community,
    }));
  }, [community]);

  if (!community) return <NotFound />;
  return (
    <>
      <Header community={community} />
      <PageContent>
        {/* Left */}
        <>
          <CreatePostLink />
          <Posts community={community} />
        </>
        {/* Right */}
        <>
          <About community={community} />
        </>
      </PageContent>
    </>
  );
};
export default CommunityPage;

//전체 커뮤니티 목록
export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );

    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        community: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      },
    };
  } catch (error) {
    //error Page 추가 가능
    console.log("ServerSideProps error-[community]", error);
  }
}
