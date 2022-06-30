import { Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

//left, right children 배열로 react.fragment 들어옴
const ContentLayout: React.FC<Props> = ({ children }) => {
  return (
    <Flex justify="center" p="16px 0px">
      <Flex
        width="95%"
        justify="center"
        maxWidth="1024px"
        mr={{ base: 0, md: 6 }}
      >
        {/* Left */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>

        {/* Right */}
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow="1"
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default ContentLayout;
