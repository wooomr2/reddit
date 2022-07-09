import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import { modalState } from "../../../atoms/modalAtom";

const AuthButtons: React.FC = () => {
  const setModalAtom = useSetRecoilState(modalState);

  return (
    <>
      <Button
        onClick={() => setModalAtom({ open: true, view: "login" })}
        variant="outline"
        mr="2"
        height="30px"
        width={{ base: "70px", md: "100px" }}
      >
        Log in
      </Button>

      <Button
        onClick={() => setModalAtom({ open: true, view: "signup" })}
        height="30px"
        mr="2"
        width={{ base: "70px", md: "100px" }}
      >
        Sign up
      </Button>
    </>
  );
};
export default AuthButtons;
