import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  title: string;
  icon: typeof Icon.arguments;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem: React.FC<Props> = ({
  title,
  icon,
  selected,
  setSelectedTab,
}) => {
  return (
    <Flex
      onClick={() => setSelectedTab(title)}
      justify="center"
      align="center"
      flexGrow="1"
      p="14px 0"
      fontWeight="700"
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      color={selected ? "blue.500" : "gray.500"}
      borderWidth={selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={selected ? "blue.500" : "gray.200"}
      borderRightColor="gray.200"
    >
      <Flex align="center" height="20px" mr="2">
        <Icon as={icon} fontSize="18" />
      </Flex>
      <Text fontSize="10pt">{title}</Text>
    </Flex>
  );
};
export default TabItem;
