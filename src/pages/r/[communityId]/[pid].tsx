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
import AboutCommunity from "../../../components/Widget/SideWidget/AboutCommunity";
import BackToTop from "../../../components/Widget/SideWidget/BackToTop";
import { auth } from "../../../firebase/clientApp";
import usePost from "../../../hooks/usePost";

const PostPage: React.FC = () => {
  const { pid, onlyComment } = useRouter().query;
  const [user] = useAuthState(auth);
  const community = useRecoilValue(communityState);
  const { getPost, loading } = usePost();
  const post = useRecoilValue(postState);

  //새로고침 시 다시 getPost
  useEffect(() => {
    if (pid && !post) {
      getPost(pid as string);
    }
  }, [pid, post]);

  if (loading) return <div>Loading....</div>
  if (!community || !post) return <NotFound />;
  return (
    <ContentLayout>
      {/* Left */}
      <>
        {!onlyComment && <PostItem post={post} isSinglePost={true} />}
        <Comments
          user={user as User}
          post={post}
          communityId={post?.communityId as string}
        />
      </>

      {/* Right */}
      <>
      <AboutCommunity community={community} />
      <BackToTop />
      </>
    </ContentLayout>
  );
};
export default PostPage;
