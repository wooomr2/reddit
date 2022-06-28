import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { Post } from "../../../atoms/postAtom";
import { firestore, storage } from "../../../firebase/clientApp";
import useFile from "../../../hooks/useFile";
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

type NewPostFormProps = {
  user: User;
  communityImageURL?: string;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const { selectedFiles, setSelectedFiles, onSelectFiles } = useFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = async () => {
    const { communityId } = router.query;

    setLoading(true);
    try {
      //CREATE new Post
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        communityId: communityId as string,
        communityImageURL: communityImageURL || "",
        creatorId: user?.uid,
        creatorDisplayName: user.email!.split("@")[0],
        title: textInputs.title,
        body: textInputs.body,
        numberOfComments: 0,
        totalVote: 0,
        createdAt: serverTimestamp() as Timestamp,
      });

      //firestore - firestorage 간 transaction은 ?
      // 자체 기능 x ==> firebase function 트리거 생성할 것

      //save Images at firestorage
      const imageURLs = [];
      if (selectedFiles) {
        let i = 0;
        for (let file of selectedFiles) {
          const imageRef = ref(storage, `posts/${postDocRef.id}/image${i}`);

          await uploadString(imageRef, file, "data_url");

          const downloadURL = await getDownloadURL(imageRef);
          imageURLs.push(downloadURL);

          i++;
        }
        //firestorage imageURL firestore에 업데이트
        await updateDoc(postDocRef, {
          imageURLs: imageURLs,
        });
      }
      router.back();
    } catch (error) {
      console.log("createPost error", error);
      setError("Error creating post");
    }
    setLoading(false);
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
export default NewPostForm;
