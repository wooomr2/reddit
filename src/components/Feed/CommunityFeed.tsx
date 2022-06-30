import { Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import usePost from "../../hooks/usePost";
import { Community } from "../../models/Community";
import PostItem from "../Post/PostItem/PostItem";
import PostLoader from "../Post/PostLoader";

type Props = {
  community: Community;
  userId?: string;
};

const CommunityFeed: React.FC<Props> = ({ community }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { loading, postAtom, getCommunityFeed } = usePost();

  useEffect(() => {
    getCommunityFeed(community.id);
  }, [user, router.query]);

  if (loading) return <PostLoader />;
  return (
    <Stack>
      {postAtom.posts.map((post, i) => (
        <PostItem key={post.id} post={post} />
      ))}
    </Stack>
  );
};

export default CommunityFeed;
