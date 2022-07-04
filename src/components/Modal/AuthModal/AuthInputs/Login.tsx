import { Button, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { modalState } from "../../../../atoms/modalAtom";
import { auth } from "../../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../../firebase/errors";
import AuthInput from "../../../UI/Auth/AuthInput";
import AuthText from "../../../UI/Auth/AuthText";

const Login: React.FC = () => {
  const setModalAtom = useSetRecoilState(modalState);
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
      <AuthInput type="email" onChange={onChange} />
      <AuthInput type="password" onChange={onChange} />

      <Text textAlign="center" color="red" fontSize="10pt">
        {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>

      <Button type="submit" width="100%" height="36px" mt="2" mb="2">
        Log In
      </Button>

      <AuthText
        title="Forgot your password?"
        link="Reset"
        onClick={() =>
          setModalAtom((prev) => ({ ...prev, view: "resetPassword" }))
        }
      />
      <AuthText
        title="New Here?"
        link="SIGN UP"
        onClick={() => setModalAtom((prev) => ({ ...prev, view: "signup" }))}
      />
    </form>
  );
};
export default Login;
