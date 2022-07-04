import { Input } from "@chakra-ui/react";
import React from "react";

type Props = {
  type: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AuthInput: React.FC<Props> = ({ type, name, onChange }) => {
  return (
    <Input
      onChange={onChange}
      required
      name={name ? name : type}
      type={type}
      placeholder={name ? name : type}
      mb="2"
      bg="gray.50"
      _placeholder={{ color: "gray.500" }}
      _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
      _focus={{
        outline: "nonne",
        bg: "white",
        border: "1px solid",
        borderColor: "blue.500",
      }}
    />
  );
};
export default AuthInput;
