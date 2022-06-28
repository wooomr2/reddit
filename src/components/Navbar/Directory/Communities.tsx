import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd, GrAnalytics } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communityAtom";
import useCommunity from "../../../hooks/useCommunity";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import MenuListItem from "./MenuListItem";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  // const communitySnippets = useRecoilValue(communityState).communitySnippets;
  const {mySnippets} = useCommunity();
  const {communitySnippets} = mySnippets;

  console.log(communitySnippets);

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />

      {/* Moderating Communities*/}
      <MenuItem width="100%" fontSize="10pt" _hover={{ bg: "gray.100" }}>
            <Flex align="center" onClick={() => setOpen(true)}>
              <Icon as={GrAdd} fontSize="17" ml="0.5" mr="2" />
              Create Community
            </Flex>
          </MenuItem>
      {communitySnippets.find((item) => item.isModerator) && (
        <Box mt={3} mb={4}>
          <Text mb="1" pl="3" fontSize="7pt" fontWeight="500" color="gray.500">
            MODERATING
          </Text>
          {/* <MenuItem width="100%" fontSize="10pt" _hover={{ bg: "gray.100" }}>
            <Flex align="center" onClick={() => setOpen(true)}>
              <Icon as={GrAdd} fontSize="17" ml="0.5" mr="2" />
              Create Community
            </Flex>
          </MenuItem> */}
          {communitySnippets
            .filter((item) => item.isModerator)
            .map((snippet) => (
              <MenuListItem
                key={snippet.communityId}
                communityId={snippet.communityId!}
                icon={FaReddit}
                iconColor="brand.100"
                imageURL={snippet.imageURL}
              />
            ))}
        </Box>
      )}

      {/* Joined Communities */}
      <Box mt="3" mb="4">
        <Text mb="1" pl="3" fontSize="7pt" fontWeight="500" color="gray.500">
          MY COMMUNITIES
        </Text>
      </Box>
      {communitySnippets
        .filter((item) => !item.isModerator)
        .map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            communityId={snippet.communityId!}
            icon={FaReddit}
            iconColor={"#116622"}
            imageURL={snippet.imageURL}
          />
        ))}
    </>
  );
};
export default Communities;
