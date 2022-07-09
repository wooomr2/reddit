import { Flex, Icon, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import usePost from "../../../hooks/usePost";
import { Post } from "../../../models/Post";
import BottomIcons from "./BottomIcons";
import VoteBox from "./VoteBox";

type Props = {
  post: Post;
  isHomePage?: boolean;
  isSinglePost?: boolean;
  isSSR?:boolean;
};

const PostItem: React.FC<Props> = ({ post, isHomePage, isSinglePost, isSSR }) => {
  const { selectPost } = usePost();
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderRadius="4"
      borderColor={isSinglePost ? "white" : "gray.300"}
      _hover={{ borderColor: isSinglePost ? "none" : "gray.500" }}
    >
      {/* 좌측 좋아요 투표 */}
      <VoteBox post={post} isSinglePost={isSinglePost} />

      {/* 게시글 FEED */}
      <Flex direction="column" width="100%">
        <Stack spacing="1" p="10px 10px">
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
            onClick={() => !isSinglePost && selectPost(post)}
          >
            <Text fontSize="12pt" fontWeight="600">
              {post.title}
            </Text>
            <Text fontSize="10pt">{post.body}</Text>

            {post.imageURLs?.length && (
              <Flex direction="column" justify="center" align="center">
                {!isSSR && loadingImage && (
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
        <BottomIcons post={post} isSinglePost={isSinglePost} />
      </Flex>
    </Flex>
  );
};
export default PostItem;
