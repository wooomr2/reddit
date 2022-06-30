import { Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { communityState } from "../../atoms/communityAtom";
import usePost from "../../hooks/usePost";
import PostItem from "../Post/PostItem/PostItem";
import PostLoader from "../Post/PostLoader";

const HomeFeed: React.FC = () => {
  const { getUserHomeFeed, getHomeFeed, postAtom, loading } = usePost();

  const communitySnippets = useRecoilValue(communityState).communitySnippets
  const isSnippetsFetched = useRecoilValue(communityState).isSnippetsFetched;

  useEffect(() => {
    isSnippetsFetched ? getUserHomeFeed(communitySnippets) : getHomeFeed();
  }, [isSnippetsFetched]);

  if (loading) return <PostLoader />;
  return (
    <Stack>
      {postAtom.posts.map((post, i) => (
        <PostItem key={post.id} post={post} />
      ))}
    </Stack>
  );
};

export default HomeFeed;
