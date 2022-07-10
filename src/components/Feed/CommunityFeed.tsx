import { Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostLoader from "../../components/UI/Loader/PostLoader";
import { auth } from "../../firebase/clientApp";
import usePost from "../../hooks/usePost";
import PostItem from "../Post/PostItem/PostItem";

const CommunityFeed: React.FC = () => {
  const { communityId } = useRouter().query;
  const [user] = useAuthState(auth);
  const { posts, loading, getCommunityFeed } = usePost();

  useEffect(() => {
    getCommunityFeed(communityId as string);
  }, [user, communityId]);

  if (loading) return <PostLoader />;
  return (
    <Stack>
      {posts.map((post, i) => (
        <PostItem key={post.id} post={post} />
      ))}
    </Stack>
  );
};

export default CommunityFeed;
