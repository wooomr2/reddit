import { Flex } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import { modalState } from "../../../../atoms/modalAtom";
import Login from "./Login";
import Signup from "./Signup";

const AuthInputs: React.FC = () => {
  const modalAtom = useRecoilValue(modalState);

  return (
    <Flex direction="column" align="center" width="100%" mt="4">
      {modalAtom.view === "login" && <Login />}
      {modalAtom.view === "signup" && <Signup />}
    </Flex>
  );
};
export default AuthInputs;
