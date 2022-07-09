import { Stack, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { sortState } from "../../atoms/featureAtom";
import { auth } from "../../firebase/clientApp";
import usePost from "../../hooks/usePost";
import PostItem from "../Post/PostItem/PostItem";
import PostLoader from "../UI/Loader/PostLoader";

type Props = {};

const BookmarkFeed: React.FC<Props> = () => {
  const [user] = useAuthState(auth);
  const { loading, getBookmarkFeed, posts, savedPostIds } = usePost();
  const sort = useRecoilValue(sortState);

  useEffect(() => {
    getBookmarkFeed(sort);
  }, [user, savedPostIds, sort]);

  if (loading) return <PostLoader />;
  if (!savedPostIds?.length)
    return <Text alignSelf="center">관심있는 Post를 저장 해보세요!</Text>;

  return (
    <Stack>
      {posts.map((post, i) => (
        <PostItem key={i} post={post} />
      ))}
    </Stack>
  );
};

export default BookmarkFeed;
