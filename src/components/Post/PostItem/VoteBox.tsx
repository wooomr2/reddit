import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import {
  IoArrowUpCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowDownCircleOutline,
} from "react-icons/io5";
import { useRecoilValue } from "recoil";
import { postState } from "../../../atoms/postAtom";
import usePost from "../../../hooks/usePost";
import { Post } from "../../../models/Post";

type Props = {
  post: Post;
  isSinglePost?:boolean
};

const VoteBox: React.FC<Props> = ({ post,isSinglePost }) => {
  const { onVote } = usePost();
  const postVotes = useRecoilValue(postState).postVotes;

  const userVote = postVotes.find(
    (postVote) => postVote.postId === post.id
  )?.vote;

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
