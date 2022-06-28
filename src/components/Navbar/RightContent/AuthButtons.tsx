import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import { modalState } from "../../../atoms/modalAtom";

type AuthButtonsProps = {};

const AuthButtons: React.FC<AuthButtonsProps> = () => {
  const setModal = useSetRecoilState(modalState);

  return (
    <>
      <Button
        onClick={()=>setModal({open:true,view:"login"})}
        variant="outline"
        mr="2"
        height="30px"
        width={{ base: "70px", md: "100px" }}
        display={{ base: "none", sm: "flex" }}
      >
        Log in
      </Button>
      <Button
        onClick={()=>setModal({open:true,view:"signup"})}
        height="30px"
        mr="2"
        width={{ base: "70px", md: "100px" }}
        display={{ base: "none", sm: "flex" }}
      >
        Sign up
      </Button>
    </>
  );
};
export default AuthButtons;
