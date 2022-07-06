import { Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
  communitySnippetsState,
  isSnippetFetchedState
} from "../../atoms/communityAtom";
import { sortState } from "../../atoms/featureAtom";
import PostLoader from "../../components/UI/Loader/PostLoader";
import usePost from "../../hooks/usePost";
import PostItem from "../Post/PostItem/PostItem";

const HomeFeed: React.FC = () => {
  const { getUserHomeFeed, getHomeFeed, posts, loading } = usePost();

  const communitySnippets = useRecoilValue(communitySnippetsState);
  const isSnippetFetched = useRecoilValue(isSnippetFetchedState);
  const sort = useRecoilValue(sortState);

  useEffect(() => {
    isSnippetFetched
      ? getUserHomeFeed(communitySnippets, sort)
      : getHomeFeed(sort);
  }, [isSnippetFetched, sort]);

  if (loading) return <PostLoader />;
  return (
    <Stack>
      {posts.map((post, i) => (
        <PostItem key={post.id} post={post} isHomePage={true} />
      ))}
    </Stack>
  );
};

export default HomeFeed;
