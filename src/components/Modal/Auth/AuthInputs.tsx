import { Flex } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import { modalState } from "../../../atoms/modalAtom";
import Login from "./Login";
import Signup from "./Signup";

type AuthInputsProps = {};

const AuthInputs: React.FC<AuthInputsProps> = () => {
  const modal = useRecoilValue(modalState)

  return (
    <Flex direction="column" align="center" width="100%" mt="4">
      {modal.view === "login" && <Login />}
      {modal.view === "signup" && <Signup />}
    </Flex>
  );
};
export default AuthInputs;
