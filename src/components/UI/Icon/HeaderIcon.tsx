import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  onClick?: () => void;
  size?: number;
};

const HeaderIcon: React.FC<Props> = ({ icon, onClick, size }) => {
  return (
    <Flex
      onClick={onClick}
      mr="1.5"
      ml="1.5"
      padding="1"
      cursor="pointer"
      borderRadius="4"
      _hover={{ bg: "gray.200" }}
    >
      <Icon as={icon} fontSize={size || 20} />
    </Flex>
  );
};
export default HeaderIcon;
