import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { BsDot, BsReddit } from "react-icons/bs";
import { useSetRecoilState } from "recoil";
import { modalState } from "../../../atoms/modalAtom";
import { auth } from "../../../firebase/clientApp";
import AuthInput from "../../UI/Auth/AuthInput";

const ResetPassword: React.FC = () => {
  const setModalAtom = useSetRecoilState(modalState);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };
  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your password
      </Text>

      {success ? (
        <Text mb={4}>Check your email :)</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb="2">
            Enter the email associated with your account and we will send you a
            reset link
          </Text>

          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <AuthInput
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Text textAlign="center" fontSize="10pt" color="red">
              {error?.message}
            </Text>

            <Button
              width="100%"
              height="36px"
              mb="2"
              mt="2"
              type="submit"
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}

      <Flex
        alignItems="center"
        fontSize="9pt"
        color="blue.500"
        fontWeight="700"
        cursor="pointer"
      >
        <Text
          onClick={() =>
            setModalAtom((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          LOGIN
        </Text>
        <Icon as={BsDot} />
        <Text
          onClick={() =>
            setModalAtom((prev) => ({
              ...prev,
              view: "signup",
            }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </Flex>
  );
};

export default ResetPassword;
