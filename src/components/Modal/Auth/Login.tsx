import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { modalState } from "../../../atoms/modalAtom";
import { auth } from "../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../firebase/errors";

const Login: React.FC = () => {
  const setModal = useSetRecoilState(modalState);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        onChange={onChange}
        required
        name="email"
        type="email"
        placeholder="email"
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
      <Input
        onChange={onChange}
        required
        name="password"
        type="password"
        placeholder="password"
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

      <Text textAlign="center" color="red" fontSize="10pt">
        {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>

      <Button type="submit" width="100%" height="36px" mt="2" mb="2">
        Log In
      </Button>

      <Flex fontSize="10pt" justifyContent="center" mb={2}>
        <Text mr="1">Forgot your password?</Text>
        <Text
          onClick={() =>
            setModal((prev) => ({ ...prev, view: "resetPassword" }))
          }
          color="blue.500"
          fontWeight="700"
          cursor="pointer"
          _hover={{ fontWeight: "900", color: "blue.600" }}
        >
          Reset
        </Text>
      </Flex>

      <Flex fontSize="10pt" justifyContent="center">
        <Text mr="1">New Here?</Text>
        <Text
          onClick={() => setModal((prev) => ({ ...prev, view: "signup" }))}
          color="blue.500"
          fontWeight="700"
          cursor="pointer"
          _hover={{ fontWeight: "900", color: "blue.600" }}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
