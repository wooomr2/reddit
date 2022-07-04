import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { modalState } from "../../../atoms/modalAtom";
import { auth } from "../../../firebase/clientApp";
import AuthInputs from "./AuthInputs/AuthInputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";


const AuthModal: React.FC = () => {
  const [modalAtom, setModalAtom] = useRecoilState(modalState);
  const [user] = useAuthState(auth);

  const handleClose = () => {
    setModalAtom((prev) => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <>
      <Modal
        isOpen={modalAtom.open}
        onClose={handleClose}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalAtom.view === "login" && "Login"}
            {modalAtom.view === "signup" && "Sign Up"}
            {modalAtom.view === "resetPassword" && "Reset Password"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pb="6"
          >
            <Flex
              direction="column"
              align="center"
              justify="cetner"
              width="70%"
            >
              {modalAtom.view === "login" || modalAtom.view === "signup" ? (
                <>
                  <AuthInputs />
                  <OAuthButtons />
                </>
              ) : (
                <ResetPassword />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
