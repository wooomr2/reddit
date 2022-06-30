import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useState } from "react";
import useComment from "../../hooks/useComment";
import { Comment } from "../../models/Comment";
import { Post } from "../../models/Post";
import AuthButtons from "../Header/RightHeader/AuthButtons";

type Props = {
  user: User;
  selectedPost: Post;
  communityId: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
};

const CommentInput: React.FC<Props> = ({
  user,
  selectedPost,
  communityId,
  setComments,
}) => {
  const [commentText, setCommentText] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const { createComment } = useComment();

  const onCreateComment = async () => {
    setCreateLoading(true);
    await createComment(
      user,
      communityId,
      selectedPost,
      commentText,
      setCommentText,
      setComments,
    );
    setCreateLoading(false);
  };

  return (
    <Flex direction="column" position="relative">
      {user ? (
        <>
          <Text mb={1}>
            Comment as{" "}
            <span style={{ color: "#3182CE" }}>
              {user?.email?.split("@")[0]}
            </span>
          </Text>
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="What are your thoughts?"
            fontSize="10pt"
            borderRadius={4}
            minHeight="160px"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid",
              borderColor: "blue.500",
            }}
          />
          <Flex
            position="absolute"
            left="1px"
            right={0.5}
            bottom="1px"
            justify="flex-end"
            bg="gray.100"
            p="6px 8px"
            borderRadius="0 0 4px 4px"
          >
            <Button
              height="26px"
              disabled={!commentText.length}
              isLoading={createLoading}
              onClick={onCreateComment}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        // !user
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;
