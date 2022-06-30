import { Flex, Icon, Image, MenuItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { IconType } from "react-icons";

type Props = {
  communityId: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

const CommunityMenuItem: React.FC<Props> = ({
  communityId,
  icon,
  iconColor,
  imageURL,
}) => {
  const router = useRouter();

  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray..100" }}
      onClick={() => router.push(`/r/${communityId}`)}
    >
      <Flex align="center">
        {imageURL ? (
          <Image
            src={imageURL}
            alt=""
            borderRadius="full"
            boxSize="18px"
            mr="2"
          />
        ) : (
          <Icon as={icon} fontSize={20} mr="2" color={iconColor} />
        )}
        r/{communityId}
      </Flex>
    </MenuItem>
  );
};
export default CommunityMenuItem;
