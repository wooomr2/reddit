import { Flex, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  children?: React.ReactNode;
  title:string;
  link:string;
  onClick?: () => void;
};

const AuthText: React.FC<Props> = ({ title, link, onClick }) => {
  return (
    <Flex fontSize="10pt" justifyContent="center" mb={2}>
      <Text mr="1">{title}</Text>
      <Text
        onClick={onClick}
        color="blue.500"
        fontWeight="700"
        cursor="pointer"
        _hover={{ fontWeight: "900", color: "blue.600" }}
      >
        {link}
      </Text>
    </Flex>
  );
};
export default AuthText;
