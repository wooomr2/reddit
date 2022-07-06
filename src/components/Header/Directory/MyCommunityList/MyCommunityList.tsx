import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import { communitySnippetsState } from "../../../../atoms/communityAtom";
import CreateCommunityModal from "../../../Modal/CreateCommunityModal/CreateCommunityModal";
import CommunityMenuItem from "./CommunityMenuItem";

const MyCommunityList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const communitySnippets = useRecoilValue(communitySnippetsState);

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
          {communitySnippets
            .filter((item) => item.isModerator)
            .map((snippet) => (
              <CommunityMenuItem
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
          <CommunityMenuItem
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
export default MyCommunityList;
