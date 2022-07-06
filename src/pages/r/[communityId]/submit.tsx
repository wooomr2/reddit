import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communityAtom";
import NotFound from "../../../components/Community/NotFound";
import ContentLayout from "../../../components/Layout/ContentLayout";
import PostForm from "../../../components/Post/PostForm/PostForm";
import Premium from "../../../components/Widget/SideWidget/Premium";
import { auth } from "../../../firebase/clientApp";

const Submit: React.FC = () => {
  const [user] = useAuthState(auth);
  const community = useRecoilValue(communityState);

  if (!community || !user) return <NotFound />;
  return (
    <ContentLayout>
      {/* Left */}
      <PostForm user={user} communityImageURL={community?.imageURL} />

      {/* Right */}
      <Premium />
    </ContentLayout>
  );
};
export default Submit;
