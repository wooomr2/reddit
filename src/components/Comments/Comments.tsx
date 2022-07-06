import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useEffect } from "react";
import useComment from "../../hooks/useComment";
import { Post } from "../../models/Post";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

type Props = {
  user: User;
  post: Post;
  communityId: string;
};

const Comments: React.FC<Props> = ({ user, post, communityId }) => {
  const { comments, getComments } = useComment();

  useEffect(() => {
    if (!post) return;
    getComments(post.id);
  }, [post]);

  return (
    <Box bg="white" borderRadius="0 0 4px 4px">
      <Flex
        direction="column"
        pl="10"
        pr="4"
        mb="6"
        width="100%"
        fontSize="10pt"
      >
        <CommentInput user={user} post={post} communityId={communityId} />
      </Flex>
      
      <Stack p="2" spacing="6">
        {comments.length === 0 ? (
          <Flex
            direction="column"
            justify="center"
            align="center"
            borderTop="1px solid"
            borderColor="gray.100"
            p={20}
          >
            <Text fontWeight={700} opacity={0.3}>
              No Comments Yet
            </Text>
          </Flex>
        ) : (
          <>
            {comments.map((comment, i) => (
              <CommentItem key={i} comment={comment} userId={user?.uid} />
            ))}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
