import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { communityState } from "../atoms/communityAtom";
import { modalState } from "../atoms/modalAtom";
import { Post, postState, PostVote } from "../atoms/postAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

const usePost = () => {
  const router = useRouter();
  const [postItems, setPostItems] = useRecoilState(postState);
  const [user] = useAuthState(auth);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const setModal = useSetRecoilState(modalState);

  useEffect(() => {
    if (!user) {
      //Clear user PostVotes in recoilState
      setPostItems((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getPostVotes(currentCommunity?.id);
  }, [user, currentCommunity]);

  const getPostVotes = async (communtyId: string) => {
    const postVotesQuery = query(
      collection(firestore, `users/${user?.uid}/postVotes`),
      where("communityId", "==", communtyId)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPostItems((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  //vote : 1(좋아요) or -1(싫어요)
  const onVote = async (post: Post, vote: 1 | -1) => {
    if (!user?.uid) {
      setModal({ open: true, view: "login" });
      return;
    }

    try {
      const { totalVote, communityId } = post;
      const existingPostVote = postItems.postVotes.find(
        (postVote) => postVote.postId === post.id
      );
      const updatedPost = { ...post };
      const updatedPosts = [...postItems.posts];
      let updatedPostVotes = [...postItems.postVotes];
      let totalVoteChange: number = vote;

      const batch = writeBatch(firestore);

      // 1. user 서브콜렉션 postVote 관련
      // 1-1) New postVote면
      if (!existingPostVote) {
        //create a new user.postVote doc
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          communityId,
          vote, //1 or -1
        };

        updatedPost.totalVote = totalVote + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];

        batch.set(postVoteRef, newVote);
      }
      // 1-2) Existing postVote면
      else {
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingPostVote.id}`
        );

        // 1-2-1) Removing postVote
        if (existingPostVote.vote === vote) {
          totalVoteChange *= -1;

          updatedPost.totalVote = totalVote - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingPostVote.id
          );

          batch.delete(postVoteRef);
        }
        // 1-2-2) 또는 Changing vote (up->down or down->up)
        else {
          totalVoteChange = 2 * vote;

          updatedPost.totalVote = totalVote + 2 * vote;

          const voteIndex = postItems.postVotes.findIndex(
            (vote) => vote.id === existingPostVote.id
          );
          // Vote was found --> findIndex , if not found --> returns -1
          //찾았으면 update
          if (voteIndex !== -1) {
            updatedPostVotes[voteIndex] = {
              ...existingPostVote,
              vote,
            };

            batch.update(postVoteRef, {
              vote,
            });
          }
        }
      }

      // 2. UPDATE Post doc
      const postIndex = postItems.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIndex!] = updatedPost;

      setPostItems((prev) => ({
        ...prev,
        selectedPost: updatedPost,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));

      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { totalVote: totalVote + totalVoteChange });

      await batch.commit();
    } catch (error) {
      console.log("onVote Error", error);
    }
  };

  const onSelectPost = (post: Post) => {
    setPostItems((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.communityId}/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      //check if image, delete firestorage if exists
      if (post.imageURLs?.length) {
        for (let i = 0; i < post.imageURLs.length; i++) {
          const imageRef = ref(storage, `posts/${post.id}/image${i}`);
          await deleteObject(imageRef);
        }
      }

      //delete post doc from firestore
      const postDocRef = doc(firestore, "posts", post.id);
      await deleteDoc(postDocRef);

      // update recoil state
      setPostItems((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
    } catch (error: any) {
      console.log("onDeletePost Error", error.message);
      return false;
    }

    return true;
  };

  return {
    postItems,
    setPostItems,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};

export default usePost;
