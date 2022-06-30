import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { modalState } from "../../../../atoms/modalAtom";
import { auth } from "../../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../../firebase/errors";

const Signup: React.FC = () => {
  const setModalAtom = useSetRecoilState(modalState);
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    comfirmPassword: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error) setError("");
    if (signupForm.password !== signupForm.comfirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    createUserWithEmailAndPassword(signupForm.email, signupForm.password);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm((prev) => ({
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
      <Input
        onChange={onChange}
        required
        name="comfirmPassword"
        type="comfirmPassword"
        placeholder="confirm password"
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

      {(error || userError) && (
        <Text textAlign="center" color="red" fontSize="10pt">
          {error ||
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}

      <Button
        type="submit"
        width="100%"
        height="36px"
        mt="2"
        mb="2"
        isLoading={loading}
      >
        SIGN UP
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr="1">Already Redditor?</Text>
        <Text
          onClick={() => setModalAtom((prev) => ({ ...prev, view: "login" }))}
          color="blue.500"
          fontWeight="700"
          cursor="pointer"
          _hover={{ fontWeight: "900", color: "blue.600" }}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default Signup;
