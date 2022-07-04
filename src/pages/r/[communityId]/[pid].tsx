import { User } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communityAtom";
import { postState } from "../../../atoms/postAtom";
import Comments from "../../../components/Comments/Comments";
import NotFound from "../../../components/Community/NotFound";
import ContentLayout from "../../../components/Layout/ContentLayout";
import PostItem from "../../../components/Post/PostItem/PostItem";
import AboutCommunity from "../../../components/Widget/AboutCommunity";
import { auth } from "../../../firebase/clientApp";
import usePost from "../../../hooks/usePost";

const PostPage: React.FC = () => {
  const { pid } = useRouter().query;
  const [user] = useAuthState(auth);
  const community = useRecoilValue(communityState).currentCommunity;
  const { getPost } = usePost();
  const selectedPost = useRecoilValue(postState).selectedPost;

  //새로고침 시 다시 getPost
  useEffect(() => {
    if (pid && !selectedPost) {
      getPost(pid as string);
    }
  }, [pid, selectedPost]);

  if (!community) return <NotFound />;
  return (
    <ContentLayout>
      {/* Left */}
      {selectedPost && (
        <>
          <PostItem post={selectedPost} isSinglePost={true} />
          <Comments
            user={user as User}
            selectedPost={selectedPost}
            communityId={selectedPost?.communityId as string}
          />
        </>
      )}

      {/* Right */}
      <AboutCommunity community={community} />
    </ContentLayout>
  );
};
export default PostPage;
