import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { FaRedditSquare } from "react-icons/fa";
import { MdOutlineLogin } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { auth } from "../../../firebase/clientApp";

type Props = {
  user?: User | null;
};

const UserMenu: React.FC<Props> = ({ user }) => {
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius="4px"
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex alignItems="center">
          <Flex alignItems="center">
            {user ? (
              <>
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    width="6"
                    height="6"
                    alt=""
                    borderRadius="full"
                    mr="2"
                  />
                ) : (
                  <Icon
                    fontSize={24}
                    mr={2}
                    color="gray.300"
                    as={FaRedditSquare}
                  />
                )}
                <Box
                  display={{ base: "none", lg: "flex" }}
                  flexDirection="column"
                  fontSize="8pt"
                  alignItems="flex-start"
                  mr={8}
                >
                  <Text fontWeight={700}>
                    {user?.displayName || user?.email?.split("@")[0]}
                  </Text>
                </Box>
              </>
            ) : (
              <Icon fontSize={24} mr={1} color="gray.400" as={VscAccount} />
            )}
          </Flex>
          <ChevronDownIcon color="gray.500" />
        </Flex>
      </MenuButton>

      <MenuList>
        <MenuItem
          fontSize="10pt"
          fontWeight={700}
          _hover={{ bg: "blue.500", color: "white" }}
        >
          <Flex alignItems="center">
            <Icon fontSize={20} mr={2} as={CgProfile} />
            Profile
          </Flex>
        </MenuItem>

        <MenuDivider />

        <MenuItem
          fontSize="10pt"
          fontWeight={700}
          _hover={{ bg: "blue.500", color: "white" }}
          onClick={logout}
        >
          <Flex alignItems="center">
            <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
            Log Out
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default UserMenu;
