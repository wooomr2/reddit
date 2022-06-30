import { Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import AuthModal from "../../Modal/AuthModal/AuthModal";
import AuthButtons from "./AuthButtons";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

type Props = {
  user?: User | null;
};

const RightHeader: React.FC<Props> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? (
          <>
            <Icons />
            <UserMenu user={user} />
          </>
        ) : (
          <AuthButtons />
        )}
      </Flex>
    </>
  );
};
export default RightHeader;
