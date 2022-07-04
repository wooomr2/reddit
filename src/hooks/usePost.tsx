import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import { postState } from "../atoms/postAtom";
import { auth, firestore, storage } from "../firebase/clientApp";
import { Post } from "../models/Post";
import { CommunitySnippet } from "../models/User/CommunitySnippet";
import { PostVote } from "../models/User/PostVote";

const usePost = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [postAtom, setPostAtom] = useRecoilState(postState);
  const setModalAtom = useSetRecoilState(modalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("totalVote", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostAtom((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log("getNoUserHomeFeeds error", error);
    }
    setLoading(false);
  };

  const getUserHomeFeed = async (communitySnippets: CommunitySnippet[]) => {
    setLoading(true);
    try {
      if (communitySnippets.length) {
        const myCommunityIds = communitySnippets.map(
          (snippet) => snippet.communityId
        );

        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          orderBy("totalVote", "desc"),
          limit(10)
        );

        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const postIds = postDocs.docs.map((doc) => doc.id);

        const postVotesQuery = query(
          collection(firestore, `users/${user?.uid}/postVotes`),
          where("postId", "in", postIds)
        );

        const postVotesDocs = await getDocs(postVotesQuery);
        const postVotes = postVotesDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPostAtom((prev) => ({
          ...prev,
          posts: posts as Post[],
          postVotes: postVotes as PostVote[],
        }));
      }
    } catch (error) {
      console.log("getUserHomeFeeds error", error);
    }
    setLoading(false);
  };

  const getCommunityFeed = async (communtyId: string) => {
    setLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communtyId),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("communityId", "==", communtyId)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostAtom((prev) => ({
        ...prev,
        posts: posts as Post[],
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log("getFeeds error", error);
    }
    setLoading(false);
  };

  const getPost = async (pid: string) => {
    try {
      const postDocRef = doc(firestore, "posts", pid);
      const postDoc = await getDoc(postDocRef);

      setPostAtom((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error) {
      console.log("getPost error", error);
    }
  };

  const createPost = async (
    user: User,
    textInputs: { title: string; body: string },
    selectedFiles: string[],
    communityImageURL?: string
  ) => {
    const { communityId } = router.query;

    setLoading(true);
    try {
      //CREATE new Post
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        communityId: communityId as string,
        communityImageURL: communityImageURL || "",
        creatorId: user?.uid,
        creatorDisplayName: user?.email!.split("@")[0],
        title: textInputs.title,
        body: textInputs.body,
        numberOfComments: 0,
        totalVote: 0,
        createdAt: serverTimestamp() as Timestamp,
      });

      //firestore - firestorage 간 transaction은 ?
      // 자체 기능 x ==> firebase function 트리거 생성할 것

      //save Images at firestorage
      const imageURLs = [];
      if (selectedFiles) {
        let i = 0;
        for (let file of selectedFiles) {
          const imageRef = ref(storage, `posts/${postDocRef.id}/image${i}`);

          await uploadString(imageRef, file, "data_url");

          const downloadURL = await getDownloadURL(imageRef);
          imageURLs.push(downloadURL);

          i++;
        }
        //firestorage imageURL firestore에 업데이트
        await updateDoc(postDocRef, {
          imageURLs: imageURLs,
        });
      }
      router.back();
    } catch (error) {
      console.log("createPost error", error);
      setError("POST 생성에 실패했습니다.");
    }

    setLoading(true);
  };

  //vote : 1(좋아요) or -1(싫어요)
  const onVote = async (post: Post, vote: 1 | -1) => {
    if (!user?.uid) {
      setModalAtom({ open: true, view: "login" });
      return;
    }

    try {
      const { totalVote, communityId } = post;
      const existingPostVote = postAtom.postVotes.find(
        (postVote) => postVote.postId === post.id
      );
      const updatedPost = { ...post };
      const updatedPosts = [...postAtom.posts];
      let updatedPostVotes = [...postAtom.postVotes];
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

          const voteIndex = postAtom.postVotes.findIndex(
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
      const postIndex = postAtom.posts.findIndex((item) => item.id === post.id);
      updatedPosts[postIndex!] = updatedPost;

      setPostAtom((prev) => ({
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
    setPostAtom((prev) => ({
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
      setPostAtom((prev) => ({
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
    getHomeFeed,
    getUserHomeFeed,
    getCommunityFeed,
    getPost,
    createPost,
    onVote,
    onDeletePost,
    onSelectPost,
    postAtom,
    loading,
    error,
  };
};

export default usePost;
