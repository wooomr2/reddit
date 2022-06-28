import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { Item } from "framer-motion/types/components/Reorder/Item";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { Post, postState } from "../../../atoms/postAtom";
import { firestore } from "../../../firebase/clientApp";
import { Comment } from "../../../models/Comment";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

type CommentsProps = {
  user: User;
  selectedPost: Post;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [getLoading, setGetLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [delId, setDelId] = useState("");
  const setPostItems = useSetRecoilState(postState);

  useEffect(() => {
    if (!selectedPost) return;
    getComments();
  }, [selectedPost]);

  const getComments = async () => {
    setGetLoading(true);
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost.id),
        orderBy("createdAt", "desc")
      );

      const commentDocs = await getDocs(commentsQuery);

      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(comments as Comment[]);
    } catch (error) {
      console.log("getComments error", error);
    }
    setGetLoading(false);
  };

  const onCreateComment = async (commentText: string) => {
    setCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      const commentDocRef = doc(collection(firestore, "comments"));

      // create a comment doc
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayName: user.email!.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      batch.set(commentDocRef, newComment);

      // update post.numberOfComments +1
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // update recoil state --> 전역관리할필요있나?
      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setPostItems((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateComment error", error);
    }

    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    setDelId(comment.id);
    try {
      const batch = writeBatch(firestore);

      // delete a comment doc
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update post.numberOfComments -1
      const postDocRef = doc(firestore, "posts", comment.postId);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // update recoil state
      setPostItems((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.log("onDeleteComment", error);
    }
    setDelId("");
  };

  return (
    <Box bg="white" borderRadius="0 0 4px 4px">
      <Flex
        direction="column"
        pl="10"
        pr="4"
        mb="6"
        width="100%"
        fontSize="10pt"
      >
        {!getLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            createLoading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack p="2" spacing="6">
        {getLoading ? (
          <>
            {[0, 1, 2].map((i) => (
              <Box key={i} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment, i) => (
                  <CommentItem
                    key={i}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    deleteLoading={delId === comment.id}
                    userId={user?.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
