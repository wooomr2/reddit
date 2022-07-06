import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  text: string | number;
  color?:string;
  loading?: boolean;
  onClick?: () => void;
};

const PostIcon: React.FC<Props> = ({ icon, text, color, loading = false, onClick }) => {
  return (
    <Flex
      align="center"
      justify="center"
      width="full"
      p="8px 10px"
      borderRadius="4"
      color={color}
      _hover={{ bg: "gray.200" }}
      cursor="pointer"
      onClick={onClick}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <>
          <Icon as={icon} mr="2" />
          <Text fontSize="9pt">{text}</Text>
        </>
      )}
    </Flex>
  );
};
export default PostIcon;
