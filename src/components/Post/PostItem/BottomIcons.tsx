import { Alert, AlertDescription, AlertIcon, Flex } from "@chakra-ui/react";
import router from "next/router";
import React, { useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat } from "react-icons/bs";
import { IoArrowRedoOutline, IoBookmarkOutline } from "react-icons/io5";
import { auth } from "../../../firebase/clientApp";
import usePost from "../../../hooks/usePost";
import { Post } from "../../../models/Post";
import PostIcon from "../../UI/Icon/PostIcon";

type Props = {
  post: Post;
  isSinglePost?: boolean;
};

const BottomIcons: React.FC<Props> = ({ post, isSinglePost }) => {
  const [user] = useAuthState(auth);
  const [delLoading, setDelLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    deletePost,
    selectPost,
    savePostIds,
    savedPostIds,
    sharedPostIds,
    sharePostIds,
  } = usePost();

  const isCreator = user?.uid === post.creatorId;
  const isSaved = useMemo(
    () => savedPostIds?.includes(post.id),
    [post, savedPostIds]
  );
  const isShared = useMemo(
    () => sharedPostIds?.includes(post.id),
    [post, sharedPostIds]
  );

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      const success = await deletePost(post);
      if (!success) throw new Error("POST 삭제 실패");

      if (isSinglePost) router.push(`/r/${post.communityId}`);
    } catch (error: any) {
      console.log("handleDelete", error.message);
      setError(error.message);
    }
    setDelLoading(false);
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
        {!isSinglePost && (
          <PostIcon
            icon={BsChat}
            text={post.numberOfComments}
            onClick={() => selectPost(post, true)}
          />
        )}
        <PostIcon
          icon={IoArrowRedoOutline}
          color={isShared ? "blue.500" : "#718096"}
          text={isShared ? "Shared" : "Share"}
          onClick={() => sharePostIds(post.id)}
        />

        <PostIcon
          icon={IoBookmarkOutline}
          color={isSaved ? "orange.500" : "#718096"}
          text={isSaved ? "Saved" : "Save"}
          onClick={() => savePostIds(post.id)}
        />

        {isCreator && (
          <PostIcon
            icon={AiOutlineDelete}
            text="Delete"
            onClick={handleDelete}
            loading={delLoading}
          />
        )}
      </Flex>
    </>
  );
};
export default BottomIcons;
