import { Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useRecoilValue } from "recoil";
import {
  communitySnippetsState,
  isSnippetFetchedState
} from "../../atoms/communityAtom";
import { sortState } from "../../atoms/featureAtom";
import usePost from "../../hooks/usePost";
import PostItem from "../Post/PostItem/PostItem";

const HomeFeed: React.FC = () => {
  const { getHomeFeed, posts, loading } = usePost();

  const communitySnippets = useRecoilValue(communitySnippetsState);
  const isSnippetFetched = useRecoilValue(isSnippetFetchedState);
  const sort = useRecoilValue(sortState);

  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (page === 1) return;
    getHomeFeed(communitySnippets, sort, page);
  }, [page]);

  useEffect(() => {
    setPage(1);
    getHomeFeed(communitySnippets, sort, 1);
  }, [isSnippetFetched, sort]);

  useEffect(() => {
    if (inView && !loading) setPage((prev) => prev + 1);
  }, [inView]);

  return (
    <Stack>
      {posts.map((post, idx) => (
        <React.Fragment key={idx}>
          {posts.length - 1 !== idx ? (
            <PostItem key={post.id} post={post} isHomePage={true} />
          ) : (
            <div ref={ref}>
              <PostItem key={post.id} post={post} isHomePage={true} />
            </div>
          )}
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default HomeFeed;

/* {ssrPosts.map((post, idx) => (
        <React.Fragment key={idx}>
          {ssrPosts.length - 1 == idx ? (
            <div ref={ref}>
              <PostItem
                key={post.id}
                post={post}
                isHomePage={true}
                isSSR={true}
              />
            </div>
          ) : (
            <PostItem key={post.id} post={post} isHomePage={true} isSSR={true}/>
          )}
        </React.Fragment>
      ))} */
