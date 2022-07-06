import {
  Box,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
  Textarea
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import useComment from "../../hooks/useComment";
import { Comment } from "../../models/Comment";

type Props = {
  comment: Comment;
  userId: string;
};

const CommentItem: React.FC<Props> = ({ comment, userId }) => {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  useEffect(() => {
    setText(comment.text);
  }, [comment]);

  const { deleteComment, updateComment } = useComment();

  const onDeleteComment = async () => {
    setDelLoading(true);
    await deleteComment(comment);
    setDelLoading(false);
  };

  const onUpdateComment = async () => {
    await updateComment(comment.id, text);
    setEditing(false);
  };

  return (
    <Flex>
      <Box mr="2">
        <Icon as={FaReddit} fontSize="30" color="gray.300" />
      </Box>

      <Stack spacing="1" width="100%">
        <Stack direction="row" align="center" fontSize="8pt">
          <Text>{comment.creatorDisplayName}</Text>
          <Text>
            {moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}
          </Text>
          {delLoading && <Spinner size="sm" />}
        </Stack>

        {userId === comment.creatorId && editing ? (
          <Textarea
            value={text}
            disabled={editing ? false : true}
            color="black"
            opacity="0.8"
            cursor="default"
            onChange={(e) => setText(e.target.value)}
          />
        ) : (
          <Text wordBreak="break-all">{text}</Text>
        )}

        <Stack direction="row" align="center" cursor="pointer" color="gray.500">
          {userId === comment.creatorId && (
            <>
              <Text
                fontSize="9pt"
                _hover={{ color: "blue.500" }}
                onClick={() => setEditing((prev) => !prev)}
              >
                Edit
              </Text>
              {editing && (
                <Text
                  fontSize="9pt"
                  _hover={{ color: "blue.500" }}
                  onClick={onUpdateComment}
                >
                  Save
                </Text>
              )}
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
