import { Box, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { FaReddit } from "react-icons/fa";
import useComment from "../../hooks/useComment";
import { Comment } from "../../models/Comment";

type Props = {
  comment: Comment;
  deleteLoading: boolean;
  userId: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setDelId: React.Dispatch<React.SetStateAction<string>>;
};

const CommentItem: React.FC<Props> = ({
  comment,
  deleteLoading,
  userId,
  setComments,
  setDelId,
}) => {
  const { deleteComment } = useComment();

  const onDeleteComment = () => {
    deleteComment(comment, setComments, setDelId);
  };

  return (
    <Flex>
      <Box mr="2">
        <Icon as={FaReddit} fontSize="30" color="gray.300" />
      </Box>

      <Stack spacing="1">
        <Stack direction="row" align="center" fontSize="8pt">
          <Text>{comment.creatorDisplayName}</Text>
          <Text>
            {moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}
          </Text>
          {deleteLoading && <Spinner size="sm" />}
        </Stack>

        <Text fontSize="10pt">{comment.text}</Text>
        
        <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          {userId === comment.creatorId && (
            <>
              <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                Edit
              </Text>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
                onClick={onDeleteComment}
              >
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};
export default CommentItem;
