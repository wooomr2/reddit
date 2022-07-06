import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { FaReddit } from "react-icons/fa";
import useCommunity from "../../hooks/useCommunity";
import { Community } from "../../models/Community";

type Props = {
  community: Community;
};

const CommunityBanner: React.FC<Props> = ({ community }) => {
  const { joinOrLeaveCommunity, communitySnippets, loading } = useCommunity();

  const currentSnippet = useMemo(
    () =>
      communitySnippets.find((snippet) => snippet.communityId === community.id),
    [communitySnippets, community.id]
  );

  const isModerator = !!currentSnippet?.isModerator;
  const isJoined = !!currentSnippet;

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400" />
      <Flex justify="center" bg="white" flexGrow="1">
        <Flex width="95%" maxWidth="1024px">
          {community?.imageURL ? (
            <Image
              src={community.imageURL}
              alt=""
              position="relative"
              top={-3}
              color="blue.500"
              boxSize="66px"
              border="4px solid white"
              borderRadius="full"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize="64"
              position="relative"
              top="-3"
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr="6">
              <Text fontWeight="800" fontSize="16pt">
                {community?.id}
              </Text>
              <Text fontWeight="600" fontSize="10pt" color="gray.400">
                r/{community?.id}
              </Text>
            </Flex>

            {isModerator ? (
              "Moderator"
            ) : (
              <Button
                variant={isJoined ? "outline" : "solid"}
                height="30px"
                pr="6"
                pl="6"
                isLoading={loading}
                onClick={() => joinOrLeaveCommunity(community, isJoined)}
              >
                {isJoined ? "Joined" : "Join"}
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default CommunityBanner;
