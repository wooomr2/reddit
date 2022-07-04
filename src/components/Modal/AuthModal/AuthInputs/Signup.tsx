import { Button, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { modalState } from "../../../../atoms/modalAtom";
import { auth } from "../../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../../firebase/errors";
import AuthInput from "../../../UI/Auth/AuthInput";
import AuthText from "../../../UI/Auth/AuthText";

const Signup: React.FC = () => {
  const setModalAtom = useSetRecoilState(modalState);
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error) setError("");
    if (signupForm.password !== signupForm.confirmPassword) {
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
      <AuthInput type="email" onChange={onChange} />
      <AuthInput type="password" onChange={onChange} />
      <AuthInput type="password" name="confirmPassword" onChange={onChange} />

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

      <AuthText
        title="Already Redditor?"
        link="LOG IN"
        onClick={() => setModalAtom((prev) => ({ ...prev, view: "login" }))}
      />
    </form>
  );
};
export default Signup;
