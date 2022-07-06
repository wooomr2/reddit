import { Flex, Icon, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp
} from "react-icons/io5";
import usePost from "../../../hooks/usePost";
import { Post } from "../../../models/Post";

type Props = {
  post: Post;
  isSinglePost?: boolean;
};

const VoteBox: React.FC<Props> = ({ post, isSinglePost }) => {
  const { onVote, postVotes } = usePost();

  const userVote = useMemo(
    () => postVotes.find((postVote) => postVote.postId === post.id)?.vote,
    [post, postVotes]
  );

  return (
    <Flex
      direction="column"
      align="center"
      bg={isSinglePost ? "white" : "gray.100"}
      p="2"
      width="40px"
      borderRadius="4"
    >
      <Icon
        onClick={(e) => onVote(post, 1)}
        as={userVote === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
        color={userVote === 1 ? "brand.100" : "gray.400"}
        fontSize="22"
        cursor="pointer"
      />
      <Text fontSize="9pt">{post.totalVote}</Text>
      <Icon
        onClick={(e) => onVote(post, -1)}
        as={userVote === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
        color={userVote === -1 ? "#4379FF" : "gray.400"}
        fontSize="22"
        cursor="pointer"
      />
    </Flex>
  );
};
export default VoteBox;
