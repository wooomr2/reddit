import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeftCircle, BsChatDots } from "react-icons/bs";
import {
  IoBookmarksOutline,
  IoNotificationsOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import HeaderIcon from "../../UI/Icon/HeaderIcon";

const Icons: React.FC = () => {
  const router = useRouter();

  return (
    <Flex justify="center" align="center" flexGrow="1">
      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <HeaderIcon icon={BsArrowLeftCircle} onClick={() => router.back()} />
        <HeaderIcon
          icon={IoVideocamOutline}
          size={22}
          onClick={() => router.push(`https://netflix-woomr815.vercel.app`)}
        />
      </Box>

      <>

        <HeaderIcon icon={BsChatDots} />
        <HeaderIcon icon={IoNotificationsOutline} />
        <HeaderIcon
          icon={IoBookmarksOutline}
          size={18}
          onClick={() => router.push(`/bookmark`)}
        />
      </>
    </Flex>
  );
};
export default Icons;
