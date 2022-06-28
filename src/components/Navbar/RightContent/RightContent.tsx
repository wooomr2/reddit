import { Button, Flex } from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

// user(?:undefiend) : user or null
type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? (
          <>
          <Icons />
          <UserMenu user={user}/>
          </>
        ) : (
          <AuthButtons />
        )}
      </Flex>
    </>
  );
};
export default RightContent;
