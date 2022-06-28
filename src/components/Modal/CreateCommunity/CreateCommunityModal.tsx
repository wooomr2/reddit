import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  Text,
  Input,
  Box,
  Stack,
  Checkbox,
  Icon,
  Flex,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { auth, firestore } from "../../../firebase/clientApp";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [communityName, setCommunityName] = useState("");
  const [communityType, setCommunityType] = useState("public");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;
    setCommunityName(e.target.value);
    setCharsRemaining(21 - e.target.value.length);
  };

  const onCommunityTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name);
  };

  const handleCreateCommunity = async () => {
    if (error) setError("");
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(communityName) || communityName.length < 3) {
      return setError(
        "커뮤니티명은 3-21글자의 숫자, 문자, _로만 작성할 수 있습니다."
      );
    }

    setLoading(true);
    // FireStore 커뮤니티 생성
    try {
      const communityDocRef = doc(firestore, "communities", communityName);

      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);

        if (communityDoc.exists()) {
          throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
        }

        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          numberOfMembers: 1,
          privacyType: communityType,
          createdAt: serverTimestamp(),
        });
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });

      router.push(`r/${communityName}`);

      handleClose();
    } catch (error: any) {
      console.log("Transaction Error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader display="flex" flexDirection="column" padding="3">
            Create a community
          </ModalHeader>
          <ModalCloseButton />

          <Divider />

          <ModalBody display="flex" flexDirection="column" padding="10x 0px">
            <Text fontWeight="600">Name</Text>
            <Text fontSize="12" color="gray.500">
              Community names including capitalization caanot be changed
            </Text>
            <Text
              position="relative"
              top="28px"
              left="10px"
              width="20px"
              color="gray.400"
            >
              r/
            </Text>
            <Input
              value={communityName}
              position="relative"
              size="sm"
              pl="22px"
              onChange={handleChange}
            />
            <Text
              color={charsRemaining === 0 ? "red" : "gray.500"}
              fontSize="9pt"
            >
              {charsRemaining} Characters remaining
            </Text>
            <Text fontSize="9pt" color="red" pt="1">
              {error}
            </Text>
            <Box mt="4" mb="4">
              <Text mb="2">Community Type</Text>
              <Stack spacing="2">
                <Checkbox
                  name="public"
                  isChecked={communityType === "public"}
                  onChange={onCommunityTypeChange}
                >
                  <Flex alignItems="center">
                    <Icon as={BsFillPersonFill} mr={2} color="gray.500" />
                    <Text fontSize="10pt" mr="1">
                      Public
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="restricted"
                  isChecked={communityType === "restricted"}
                  onChange={onCommunityTypeChange}
                >
                  <Flex alignItems="center">
                    <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                    <Text fontSize="10pt" mr="1">
                      Restricted
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="private"
                  isChecked={communityType === "private"}
                  onChange={onCommunityTypeChange}
                >
                  <Flex alignItems="center">
                    <Icon as={HiLockClosed} color="gray.500" mr={2} />
                    <Text fontSize="10pt" mr="1">
                      Private
                    </Text>
                  </Flex>
                </Checkbox>
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              bg="white"
              mr="2"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
