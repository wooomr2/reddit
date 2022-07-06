import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React from "react";

type Props = {
  textInputs: {
    title: string;
    body: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const TextInputs: React.FC<Props> = ({
  textInputs,
  onChange,
  handleCreatePost,
  loading,
}) => {
  return (
    <Stack spacing="3" width="100%">
      <Input
        name="title"
        value={textInputs.title}
        onChange={onChange}
        fontSize="10pt"
        borderRadius="4"
        placeholder="Title"
      />
      <Textarea
        name="body"
        value={textInputs.body}
        onChange={onChange}
        height="100px"
        fontSize="10pt"
        borderRadius="4"
        placeholder="Text"
      />
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0 30px"
          disabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          POST
        </Button>
      </Flex>
    </Stack>
  );
};
export default TextInputs;
