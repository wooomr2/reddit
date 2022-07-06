import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaReddit } from "react-icons/fa";
import useCommunity from "../../../hooks/useCommunity";
import { Community } from "../../../models/Community";
import TopCommuLoader from "../../UI/Loader/TopCommuLoader";

const TopCommunities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [limit, setLimit] = useState(5);
  const { getCommunities, joinOrLeaveCommunity, communitySnippets, loading } =
    useCommunity();

  useEffect(() => {
    getCommunities(setCommunities, limit);
  }, [limit]);

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      cursor="pointer"
      border="1px solid"
      borderColor="gray.300"
      position="sticky"
      top="60px"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        bg="blue.500"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={600}
        bgImage="url(/images/recCommsArt.png)"
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
    url('images/recCommsArt.png')"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {loading ? (
          <TopCommuLoader />
        ) : (
          <>
            {communities.map((item, index) => {
              const isJoined = !!communitySnippets.find(
                (snippet) => snippet.communityId === item.id
              );
              return (
                <Link key={item.id} href={`/r/${item.id}`}>
                  <Flex
                    position="relative"
                    align="center"
                    fontSize="10pt"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    p="10px 12px"
                    fontWeight={600}
                  >
                    <Flex width="80%" align="center">
                      <Flex width="15%">
                        <Text mr={2}>{index + 1}</Text>
                      </Flex>
                      <Flex align="center" width="80%">
                        {item.imageURL ? (
                          <Image
                            borderRadius="full"
                            boxSize="28px"
                            src={item.imageURL}
                            alt=""
                            mr={2}
                          />
                        ) : (
                          <Icon
                            as={FaReddit}
                            fontSize={30}
                            color="brand.100"
                            mr={2}
                          />
                        )}
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >{`r/${item.id}`}</span>
                      </Flex>
                    </Flex>
                    <Box position="absolute" right="10px">
                      <Button
                        height="22px"
                        fontSize="8pt"
                        onClick={(event) => {
                          event.stopPropagation();
                          joinOrLeaveCommunity(item, isJoined);
                        }}
                        variant={isJoined ? "outline" : "solid"}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </Button>
                    </Box>
                  </Flex>
                </Link>
              );
            })}
            <Box p="10px 20px">
              {limit === 5 ? (
                <Button
                  height="30px"
                  width="100%"
                  onClick={() => setLimit(100)}
                >
                  View More
                </Button>
              ) : (
                <Button height="30px" width="100%" onClick={() => setLimit(5)}>
                  Shorten
                </Button>
              )}
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default TopCommunities;
