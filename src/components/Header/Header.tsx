import { Flex, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import Directory from "./Directory/Directory";
import RightHeader from "./RightHeader/RightHeader";
import SearchInput from "./SearchInput";

const Header: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  return (
    <Flex
      zIndex="9000"
      position="sticky"
      top="0"
      bg="white"
      height="44px"
      padding="6px 12px"
      boxShadow="base"
      
    >
      <Flex align="center" cursor="pointer" mr="2" onClick={() => router.push(`/`)}>
        <Image src="/images/redditFace.svg" alt="" height="30px" minHeight="22px" minWidth="22px" />
        <Image
          src="/images/redditText.svg"
          alt=""
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      
      <Directory />
      <SearchInput />
      <RightHeader user={user} />
    </Flex>
  );
};
export default Header;
