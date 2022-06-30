import { Flex, Stack, Button, Image } from "@chakra-ui/react";
import React from "react";

type Props = {
  selectedFiles?: string[];
  fileRef: React.RefObject<HTMLInputElement>;
  setSelectedTab: (value: string) => void;
  setSelectedFiles: (value: string[]) => void;
  onSelectFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImagesUpload: React.FC<Props> = ({
  selectedFiles,
  fileRef,
  setSelectedTab,
  setSelectedFiles,
  onSelectFiles,
}) => {
  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {selectedFiles?.length ? (
        <>
          {selectedFiles.map((file, i) => (
            <Image
              key={i}
              src={file as string}
              alt=""
              maxWidth="-moz-max-content"
              maxHeight="500px"
            />
          ))}
          <Stack direction="row" mt="2">
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFiles([])}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed"
          borderColor="gray.200"
          borderRadius={4}
          width="100%"
        >
          <Button
            variant="outline"
            height="28px"
            onClick={() => fileRef.current?.click()}
          >
            Upload
          </Button>
          <input
            type="file"
            multiple
            id="file-multiple"
            accept="image/x-png,image/gif,image/jpeg"
            hidden
            ref={fileRef}
            onChange={onSelectFiles}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ImagesUpload;
