import { Flex, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

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
      <Flex align="center" cursor="pointer" onClick={() => router.push(`/`)}>
        <Image src="/images/redditFace.svg" alt="" height="30px" />
        <Image
          src="/images/redditText.svg"
          alt=""
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      <Directory />
      <SearchInput />
      <RightContent user={user} />
    </Flex>
  );
};
export default Navbar;
