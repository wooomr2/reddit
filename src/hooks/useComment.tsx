import { firestore } from "../firebase/clientApp";
import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  doc,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { User } from "firebase/auth";
import { postState } from "../atoms/postAtom";
import { useSetRecoilState } from "recoil";

const useComment = () => {
  const setPostAtom = useSetRecoilState(postState);

  const getComments = async (
    selectedPostId: string,
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>
  ) => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPostId),
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
  };

  const createComment = async (
    user: User,
    communityId: string,
    selectedPost: Post,
    commentText: string,
    setCommentText: React.Dispatch<React.SetStateAction<string>>,
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>
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
      setPostAtom((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error) {
      console.log("onCreateComment error", error);
    }
  };

  const deleteComment = async (
    comment: Comment,
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
    setDelId: React.Dispatch<React.SetStateAction<string>>
  ) => {
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
      setPostAtom((prev) => ({
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

  return { getComments, createComment, deleteComment };
};

export default useComment;
