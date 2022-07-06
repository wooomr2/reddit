import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { auth } from "../../../firebase/clientApp";
import useCommunity from "../../../hooks/useCommunity";
import useFile from "../../../hooks/useFile";
import { Community } from "../../../models/Community";

type Props = {
  community: Community;
};

const AboutCommunity: React.FC<Props> = ({ community }) => {
  const router = useRouter();
  const { pid } = router.query;
  const [user] = useAuthState(auth);
  const fileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, onSelectFile } = useFile();
  const [imageLoading, setImageLoading] = useState(false);
  const { updateCommunityImage } = useCommunity();

  const handleUpdateImage = async () => {
    if (!selectedFile) return;
    setImageLoading(true);
    try {
      await updateCommunityImage(community.id, selectedFile);
    } catch (error: any) {
      console.log("updateImage error", error.message);
    }
    setImageLoading(false);
  };

  return (
    <Box position="sticky" top="60px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p="3"
        borderRadius="4px 4px 0 0 "
      >
        <Text fontWeight="700">About Community</Text>
        <Icon as={HiOutlineDotsHorizontal} cursor="pointer" />
      </Flex>

      <Flex direction="column" p="3" bg="white" borderRadius="0 0 4px 4px">
        <Stack>
          <Flex width="100%" p="2" fontSize="10pt" fontWeight="700">
            <Flex direction="column" flexGrow="1">
              <Text>{community?.numberOfMembers?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow="1">
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>

          <Divider />

          <Flex
            align="center"
            width="100%"
            p="1"
            fontWeight="500"
            fontSize="10pt"
          >
            <Icon as={RiCakeLine} mr="2" fontSize="18" />
            {community?.createdAt! && (
              <Text>
                Created{" "}
                {moment(new Date(community.createdAt.seconds * 1000)).format(
                  "MMM DD, YYYY"
                )}
              </Text>
            )}
          </Flex>

          {pid && (
            <Link href={`/r/${community.id}`}>
              <Button mt="3" height="30px">
                back to Community
              </Button>
            </Link>
          )}

          {user && (
            <Link href={`/r/${community.id}/submit`}>
              <Button mt="3" height="30px">
                Create Post
              </Button>
            </Link>
          )}

          {/* 관리자 커뮤니티 메인 이미지 변경  */}
          {user?.uid === community.creatorId && (
            <>
              <Divider />
              <Stack fontSize="10pt" spacing="1">
                <Text fontWeight="600">Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    onClick={() => fileRef.current?.click()}
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Change Image
                  </Text>
                  {community?.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || community?.imageURL}
                      alt=""
                      borderRadius="full"
                      boxSize="40px"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize="40"
                      color="brand.100"
                      mr="2"
                    />
                  )}
                </Flex>
                {imageLoading ? (
                  <Spinner />
                ) : (
                  <Text
                    onClick={handleUpdateImage}
                    cursor="pointer"
                    hidden={!selectedFile}
                    _hover={{ textDecoration: "underline" }}
                  >
                    Save Changes
                  </Text>
                )}

                <input
                  id="file-upload"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={fileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default AboutCommunity;
