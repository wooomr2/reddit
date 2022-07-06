import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { FaRedditSquare } from "react-icons/fa";
import { HiOutlineDotsHorizontal, HiStar } from "react-icons/hi";
import { IoFlame, IoFlash } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { sortState } from "../../../atoms/featureAtom";

type Props = {};

const FilterWidget: React.FC<Props> = () => {
  const [sort, setSort] = useRecoilState(sortState);

  return (
    <Flex
      justify="flex-start"
      align="center"
      bg="white"
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
      p={4}
      mb={4}
    >
      <Icon
        as={FaRedditSquare}
        fontSize={36}
        color="gray.300"
        mr={4}
        display={{ base: "none", lg: "flex" }}
      />

      <Flex
        mr={4}
        color="blue.500"
        cursor="pointer"
        py={1.5}
        px={4}
        bg={sort === "totalVote" ? "blue.100" : "gray.100"}
        borderRadius="full"
        onClick={() => setSort("totalVote")}
      >
        <Icon as={HiStar} fontSize={18} mr={1} />
        <Text fontSize="10pt" fontWeight={600}>
          Top
        </Text>
      </Flex>

      <Flex
        mr={4}
        color="blue.500"
        cursor="pointer"
        py={1.5}
        px={4}
        bg={sort === "numberOfComments" ? "blue.100" : "gray.100"}
        borderRadius="full"
        onClick={() => setSort("numberOfComments")}
      >
        <Icon as={IoFlame} fontSize={18} mr={1} />
        <Text fontSize="10pt" fontWeight={600}>
          Hot
        </Text>
      </Flex>

      <Flex
        mr={4}
        color="blue.500"
        cursor="pointer"
        py={1.5}
        px={4}
        bg={sort === "createdAt" ? "blue.100" : "gray.100"}
        borderRadius="full"
        onClick={() => setSort("createdAt")}
      >
        <Icon as={IoFlash} fontSize={18} mr={1} />
        <Text fontSize="10pt" fontWeight={600}>
          Newest
        </Text>
      </Flex>

      <Icon
        as={HiOutlineDotsHorizontal}
        cursor="pointer"
        display={{ base: "none", md: "flex" }}
      />
    </Flex>
  );
};
export default FilterWidget;
