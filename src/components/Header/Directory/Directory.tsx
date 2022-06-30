import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Icon, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { TiHome } from "react-icons/ti";
import MyCommunityList from "./MyCommunityList/MyCommunityList";

const Directory: React.FC = () => {
  const router = useRouter();
  const { communityId } = router.query;

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius="4"
        margin="0 2px"
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <Icon as={TiHome} fontSize="24" mr={{ base: 1, md: 2 }} />
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight="600">{communityId ? communityId : "HOME"}</Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>

      <MenuList maxHeight="300px" overflow="scroll" overflowX="hidden">
        <MyCommunityList />
      </MenuList>
    </Menu>
  );
};

export default Directory;
