import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import useComment from "../../hooks/useComment";
import { Comment } from "../../models/Comment";
import { Post } from "../../models/Post";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

type Props = {
  user: User;
  selectedPost: Post;
  communityId: string;
};

const Comments: React.FC<Props> = ({ user, selectedPost, communityId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [delId, setDelId] = useState("");
  const { getComments } = useComment();

  useEffect(() => {
    if (!selectedPost) return;
    getComments(selectedPost.id, setComments);
  }, [selectedPost]);

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
        <CommentInput
          user={user}
          selectedPost={selectedPost}
          communityId={communityId}
          setComments={setComments}
        />
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
              <CommentItem
                key={i}
                comment={comment}
                deleteLoading={delId === comment.id}
                userId={user?.uid}
                setComments={setComments}
                setDelId={setDelId}
              />
            ))}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
