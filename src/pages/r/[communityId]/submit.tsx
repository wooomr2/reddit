import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communityAtom";
import About from "../../../components/Community/About";
import PageContent from "../../../components/Layout/PageContent";
import NewPostForm from "../../../components/Post/PostForm/NewPostForm";
import { auth } from "../../../firebase/clientApp";
import useCommunity from "../../../hooks/useCommunity";

const Submit: React.FC = () => {
  const [user] = useAuthState(auth);
  const { mySnippets } = useCommunity();

  return (
    <PageContent>
      {/* Left */}
      <>
        {/* <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box> */}
        {user && <NewPostForm user={user} communityImageURL={mySnippets.currentCommunity?.imageURL}/>}
      </>
      {/* Right */}
      <>
        {mySnippets.currentCommunity && (
          <About community={mySnippets.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default Submit;
