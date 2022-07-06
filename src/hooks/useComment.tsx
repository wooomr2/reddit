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
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { postState } from "../atoms/postAtom";
import { firestore } from "../firebase/clientApp";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";

const useComment = () => {
  const setPost = useSetRecoilState(postState);
  const [comments, setComments] = useState<Comment[]>([]);

  const getComments = async (postId: string) => {
    try {
      const q = query(
        collection(firestore, "comments"),
        where("postId", "==", postId),
        orderBy("createdAt", "desc")
      );

      const commentDocs = await getDocs(q);

      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(comments as Comment[]);
    } catch (error) {
      console.log("getComments error", error);
    }
  };

  const createComment = async (
    user: User,
    communityId: string,
    post: Post,
    commentText: string
  ) => {
    try {
      const batch = writeBatch(firestore);

      const commentDocRef = doc(collection(firestore, "comments"));

      // create a comment doc
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayName: user.email!.split("@")[0],
        communityId,
        postId: post?.id!,
        postTitle: post?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      batch.set(commentDocRef, newComment);

      // update post.numberOfComments +1
      const postDocRef = doc(firestore, "posts", post?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      setComments((prev) => [newComment, ...prev]);
      setPost(
        (prev) =>
          ({ ...prev, numberOfcomments: prev?.numberOfComments! + 1 } as Post)
      );
    } catch (error) {
      console.log("onCreateComment error", error);
    }
  };

  const deleteComment = async (comment: Comment) => {
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
      setPost(
        (prev) =>
          ({ ...prev, numberOfcomments: prev?.numberOfComments! + -1 } as Post)
      );
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error) {
      console.log("onDeleteComment", error);
    }
  };

  const updateComment = async (commentId: string, text: string) => {
    try {
      await updateDoc(doc(firestore, "comments", commentId), {
        text,
      });

      setComments((prev) =>
        prev.map((item) =>
          item.id === commentId ? ({ ...item, text } as Comment) : item
        )
      );
    } catch (error) {
      console.log("updateComment error", error);
    }
  };

  return {
    comments,
    getComments,
    createComment,
    deleteComment,
    updateComment,
  };
};

export default useComment;
