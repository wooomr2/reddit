import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../../atoms/postAtom";
import About from "../../../components/Community/About";
import PageContent from "../../../components/Layout/PageContent";
import Comments from "../../../components/Post/Comments/Comments";
import PostItem from "../../../components/Post/PostItem";
import { auth, firestore } from "../../../firebase/clientApp";
import useCommunity from "../../../hooks/useCommunity";
import usePost from "../../../hooks/usePost";

const PostPage: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { mySnippets } = useCommunity();
  const { postItems, setPostItems, onDeletePost, onVote } = usePost();
  const { selectedPost, postVotes } = postItems;
  const { communityId, pid } = router.query;

  //새로고침 시 다시 getPost
  useEffect(() => {
    if (pid && !selectedPost) {
      getPost();
    }
  }, [pid, selectedPost]);

  const getPost = async () => {
    try {
      const postDocRef = doc(firestore, "posts", pid as string);
      const postDoc = await getDoc(postDocRef);

      setPostItems((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error) {
      console.log("getPost error", error);
    }
  };

  return (
    <PageContent>
      {/* Left */}
      <>
        {selectedPost && (
          <>
            <PostItem
              post={selectedPost}
              userIsCreator={user?.uid === selectedPost?.creatorId}
              userVote={
                postVotes.find((item) => item.postId === selectedPost.id)?.vote
              }
              onVote={onVote}
              onDeletePost={onDeletePost}
            />
            <Comments
              user={user as User}
              selectedPost={selectedPost}
              communityId={selectedPost?.communityId as string}
            />
          </>
        )}
      </>
      {/* Right */}
      <>
        {mySnippets.currentCommunity && (
          <About community={mySnippets.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default PostPage;
