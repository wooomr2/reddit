import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useRef, useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import useFile from "../../../hooks/useFile";
import usePost from "../../../hooks/usePost";
import ImagesUpload from "./ImagesUpload";
import TabItem from "./TabItem";
import TextInputs from "./TextInputs";

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

type Props = {
  user: User;
  communityImageURL?: string;
};

const PostForm: React.FC<Props> = ({ user, communityImageURL }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const { selectedFiles, setSelectedFiles, onSelectFiles } = useFile();
  const { createPost, loading, error } = usePost();

  const handleCreatePost = () => {
    createPost(user, textInputs, selectedFiles, communityImageURL);
  };

  const onTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = e;

    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius="4" mt="0.5">
      {/* TAB ITEM */}
      <Flex width="100%">
        {formTabs.map((tab, i) => (
          <TabItem
            key={i}
            title={tab.title}
            icon={tab.icon}
            selected={tab.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>

      {/* TEXT INPUTS */}
      <Flex p="4">
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            loading={loading}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
          />
        )}
        {selectedTab === "Images" && (
          <ImagesUpload
            selectedFiles={selectedFiles}
            fileRef={fileRef}
            setSelectedTab={setSelectedTab}
            setSelectedFiles={setSelectedFiles}
            onSelectFiles={onSelectFiles}
          />
        )}
      </Flex>

      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Creating Post ERROR !</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Flex>
  );
};
export default PostForm;
