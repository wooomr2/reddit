import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../firebase/errors";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  return (
    <Flex direction="column" width="100%" mt="2">
      <Button
        onClick={() => signInWithGoogle()}
        isLoading={loading}
        variant="oauth"
        mb="2"
      >
        <Image src="/images/googlelogo.png" alt="" height="20px" mr="4" />
        Continue with Google
      </Button>

      <Text textAlign="center" color="red" fontSize="10pt">
        {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>
    </Flex>
  );
};
export default OAuthButtons;
