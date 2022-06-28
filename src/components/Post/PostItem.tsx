import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { Post } from "../../atoms/postAtom";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVote?: number;
  onVote: (post: Post, vote: 1 | -1) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  isHomePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userIsCreator,
  userVote,
  onVote,
  onDeletePost,
  onSelectPost,
  isHomePage,
}) => {
  const router = useRouter();
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState("");
  const isSinglePost = !onSelectPost;

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
    <Flex
      border="1px solid"
      bg="white"
      borderRadius="4"
      borderColor={isSinglePost ? "white" : "gray.300"}
      _hover={{ borderColor: isSinglePost ? "none" : "gray.500" }}
    >
      {/* 좌측 좋아요 투표 */}
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
          as={
            userVote === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline
          }
          color={userVote === -1 ? "#4379FF" : "gray.400"}
          fontSize="22"
          cursor="pointer"
        />
      </Flex>

      {/* 게시글 FEED */}
      <Flex direction="column" width="100%">
        <Stack
          spacing="1"
          p="10px 10px"
          // cursor={isSinglePost ? "default" : "pointer"}
          // onClick={() => onSelectPost && onSelectPost(post)}
        >
          {/* 에러 메세지 */}
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* 상단 게시물 정보 */}
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            {/* HomePage인경우 커뮤니티링크 */}
            {isHomePage && (
              <>
                {post.communityImageURL ? (
                  <Image
                    src={post.communityImageURL}
                    alt=""
                    borderRadius="full"
                    boxSize="18px"
                    mr="2"
                  />
                ) : (
                  <Icon as={FaReddit} fontSize="18pt" mr="1" color="blue.500" />
                )}
                <Link href={`r/${post.communityId}`}>
                  <Text
                    _hover={{ color: "blue.600", textDecoration: "underline" }}
                    cursor="pointer"
                    fontWeight="700"
                  >{`r/${post.communityId}`}</Text>
                </Link>
                <Icon as={BsDot} color="gray.500" fontSize="10" />
              </>
            )}
            <Text>
              Posted by u/{post.creatorDisplayName}{" "}
              {post?.createdAt! &&
                moment(new Date(post.createdAt.seconds * 1000)).fromNow()}
            </Text>
          </Stack>

          {/* 본문 TITLE, BODY, IMAGE */}
          <Stack
            direction="column"
            cursor={isSinglePost ? "default" : "pointer"}
            onClick={() => onSelectPost && onSelectPost(post)}
          >
            <Text fontSize="12pt" fontWeight="600">
              {post.title}
            </Text>
            <Text fontSize="10pt">{post.body}</Text>

            {post.imageURLs?.length && (
              <Flex direction="column" justify="center" align="center">
                {loadingImage && (
                  <Skeleton height="300px" width="100%" borderRadius="4" />
                )}
                {post.imageURLs.map((imgURL, i) => (
                  <Image
                    key={i}
                    maxWidth="-moz-max-content"
                    maxHeight="500px"
                    src={imgURL}
                    alt="Post Image"
                    display={loadingImage ? "none" : "unset"}
                    onLoad={() => setLoadingImage(false)}
                  />
                ))}
              </Flex>
            )}
          </Stack>
        </Stack>

        {/* 하단 아이콘 */}
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
          {userIsCreator && (
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
      </Flex>
    </Flex>
  );
};
export default PostItem;
