import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  Icon,
  Spinner,
  Text
} from "@chakra-ui/react";
import router from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat } from "react-icons/bs";
import { IoArrowRedoOutline, IoBookmarkOutline } from "react-icons/io5";
import { auth } from "../../../firebase/clientApp";
import usePost from "../../../hooks/usePost";
import { Post } from "../../../models/Post";

type Props = {
  post: Post;
  isSinglePost?: boolean;
};

const BottomIcons: React.FC<Props> = ({ post, isSinglePost }) => {
  const [user] = useAuthState(auth);
  const isCreator = user?.uid === post.creatorId;
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState("");
  const { onDeletePost } = usePost();

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) throw new Error("POST 삭제 실패");

      if (isSinglePost) router.push(`/r/${post.communityId}`);
    } catch (error: any) {
      console.log("handleDelete", error.message);
      setError(error.message);
    }
    setLoadingDelete(false);
  };

  return (
    <>
      {/* 에러 메세지 */}
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Flex justify="space-evenly" color="gray.500" fontWeight="600">
        <Flex
          align="center"
          justify="center"
          width="full"
          p="8px 10px"
          borderRadius="4"
          _hover={{ bg: "gray.200" }}
          cursor="pointer"
        >
          <Icon as={BsChat} mr="2" />
          <Text fontSize="9pt">{post.numberOfComments}</Text>
        </Flex>
        <Flex
          align="center"
          justify="center"
          width="full"
          p="8px 10px"
          borderRadius="4"
          _hover={{ bg: "gray.200" }}
          cursor="pointer"
        >
          <Icon as={IoArrowRedoOutline} mr="2" />
          <Text fontSize="9pt">Share</Text>
        </Flex>
        <Flex
          align="center"
          justify="center"
          width="full"
          p="8px 10px"
          borderRadius="4"
          _hover={{ bg: "gray.200" }}
          cursor="pointer"
        >
          <Icon as={IoBookmarkOutline} mr="2" />
          <Text fontSize="9pt">Save</Text>
        </Flex>
        {isCreator && (
          <Flex
            align="center"
            justify="center"
            width="full"
            p="8px 10px"
            borderRadius="4"
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
            onClick={handleDelete}
          >
            {loadingDelete ? (
              <Spinner size="sm" />
            ) : (
              <>
                <Icon as={AiOutlineDelete} mr="2" />
                <Text fontSize="9pt">Delete</Text>
              </>
            )}
          </Flex>
        )}
      </Flex>
    </>
  );
};
export default BottomIcons;
