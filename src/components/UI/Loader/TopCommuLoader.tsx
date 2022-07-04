import { Stack, Flex, SkeletonCircle, Skeleton } from "@chakra-ui/react";
import React from "react";

const TopCommuLoader: React.FC = () => {
  return (
    <Stack mt={2} p={4}>
      <Flex justify="space-between" align="center">
        <SkeletonCircle size="10" />
        <Skeleton height="10px" width="70%" />
      </Flex>
      <Flex justify="space-between" align="center">
        <SkeletonCircle size="10" />
        <Skeleton height="10px" width="70%" />
      </Flex>
      <Flex justify="space-between" align="center">
        <SkeletonCircle size="10" />
        <Skeleton height="10px" width="70%" />
      </Flex>
      <Flex justify="space-between" align="center">
        <SkeletonCircle size="10" />
        <Skeleton height="10px" width="70%" />
      </Flex>
    </Stack>
  );
};
export default TopCommuLoader;
