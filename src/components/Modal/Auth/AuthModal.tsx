import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import { modalState } from "../../../atoms/modalAtom";
import { auth } from "../../../firebase/clientApp";
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";

type AuthModalProps = {};

const AuthModal: React.FC<AuthModalProps> = () => {
  const [modal, setModal] = useRecoilState(modalState);
  const [user, loading, error] = useAuthState(auth);

  const handleClose = () => {
    setModal((prev) => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if (user) handleClose();
  }, [user]);

  return (
    <>
      <Modal isOpen={modal.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modal.view === "login" && "Login"}
            {modal.view === "signup" && "Sign Up"}
            {modal.view === "resetPassword" && "Reset Password"}
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
              {modal.view === "login" || modal.view === "signup" ? (
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
