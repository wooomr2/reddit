import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  startAfter,
  Timestamp,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString
} from "firebase/storage";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import {
  postsState,
  postState,
  postVotesState,
  savedPostIdsState,
  sharedPostIdsState
} from "../atoms/postAtom";
import { auth, firestore, storage } from "../firebase/clientApp";
import { Post } from "../models/Post";
import { CommunitySnippet } from "../models/User/CommunitySnippet";
import { PostVote } from "../models/User/PostVote";

const usePost = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const setModalAtom = useSetRecoilState(modalState);
  const setPost = useSetRecoilState(postState);
  const [posts, setPosts] = useRecoilState(postsState);
  const [postVotes, setPostVotes] = useRecoilState(postVotesState);
  const [savedPostIds, setSavedPostIds] = useRecoilState(savedPostIdsState);
  const [sharedPostIds, setSharedPostIds] = useRecoilState(sharedPostIdsState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [last, setLast] = useState<QueryDocumentSnapshot<DocumentData>>();

  const getVisitorHomeFeed = async (sort: string, page: number) => {
    setLoading(true);

    let snapshot;

    try {
      if (page === 1) {
        const fisrtQuery = query(
          collection(firestore, "posts"),
          orderBy(sort, "desc"),
          limit(10)
        );

        snapshot = await getDocs(fisrtQuery);

        setLast(snapshot.docs[snapshot.docs.length - 1]);

        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(posts as Post[]);
        return setLoading(false);
      } else {
        const nextQuery = query(
          collection(firestore, "posts"),
          orderBy(sort, "desc"),
          startAfter(last),
          limit(10)
        );

        snapshot = await getDocs(nextQuery);

        setLast(snapshot.docs[snapshot.docs.length - 1]);
      }

      const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPosts((prev) => prev.concat(posts as Post[]));
    } catch (error) {
      console.log("getNoUserHomeFeeds error", error);
    }

    setLoading(false);
  };

  const getHomeFeed = async (
    communitySnippets: CommunitySnippet[],
    sort: string,
    page: number
  ) => {
    if (!communitySnippets?.length) return getVisitorHomeFeed(sort, page);

    setLoading(true);
    try {
      const myCommunityIds = communitySnippets.map(
        (snippet) => snippet.communityId
      );

      let snapshot;

      if (page === 1) {
        const firstQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          orderBy(sort, "desc"),
          limit(10)
        );

        snapshot = await getDocs(firstQuery);

        setLast(snapshot.docs[snapshot.docs.length - 1]);

        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const postIds = snapshot.docs.map((doc) => doc.id);

        const q2 = query(
          collection(firestore, `users/${user?.uid}/postVotes`),
          where("postId", "in", postIds)
        );

        const postVotesDocs = await getDocs(q2);
        const postVotes = postVotesDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(posts as Post[]);
        setPostVotes(postVotes as PostVote[]);

        return setLoading(false);
      } else {
        const nextQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          orderBy(sort, "desc"),
          startAfter(last),
          limit(10)
        );

        snapshot = await getDocs(nextQuery);

        setLast(snapshot.docs[snapshot.docs.length - 1]);
      }

      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const postIds = snapshot.docs.map((doc) => doc.id);

      const q2 = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );

      const postVotesDocs = await getDocs(q2);
      const postVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts((prev) => prev.concat(posts as Post[]));
      setPostVotes((prev) => prev.concat(postVotes as PostVote[]));
    } catch (error) {
      console.log("getUserHomeFeeds error", error);
    }

    setLoading(false);
  };

  const getCommunityFeed = async (communtyId: string) => {
    setLoading(true);

    try {
      const q = query(
        collection(firestore, "posts"),
        where("communityId", "==", communtyId),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(q);

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const q2 = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("communityId", "==", communtyId)
      );
      const postVoteDocs = await getDocs(q2);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(posts as Post[]);
      setPostVotes(postVotes as PostVote[]);
    } catch (error) {
      console.log("getFeeds error", error);
    }

    setLoading(false);
  };

  const getBookmarkFeed = async (sort: string) => {
    if (!savedPostIds?.length) return;
    setLoading(true);

    try {
      const q = query(
        collection(firestore, "posts"),
        where(documentId(), "in", savedPostIds)
      );

      const postDocs = await getDocs(q);

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const postIds = postDocs.docs.map((doc) => doc.id);

      const q2 = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );
      const postVoteDocs = await getDocs(q2);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(posts as Post[]);
      setPostVotes(postVotes as PostVote[]);
    } catch (error) {
      console.log("getFeeds error", error);
    }

    setLoading(false);
  };

  const getPost = async (pid: string) => {
    setLoading(true);

    try {
      const postDocRef = doc(firestore, "posts", pid);
      const postDoc = await getDoc(postDocRef);

      setPost({ id: postDoc.id, ...postDoc.data() } as Post);
    } catch (error) {
      console.log("getPost error", error);
    }

    setLoading(false);
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

  const deletePost = async (post: Post): Promise<boolean> => {
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
      setPosts((prev) => prev.filter((item) => item.id !== post.id));
    } catch (error: any) {
      console.log("onDeletePost Error", error.message);
      return false;
    }

    return true;
  };

  const selectPost = (post: Post, onlyComment?: boolean) => {
    setPost(post);
    onlyComment
      ? router.push({
          pathname: `/r/${post.communityId}/${post.id}`,
          query: { onlyComment: true },
        })
      : router.push(`/r/${post.communityId}/${post.id}`);
  };

  //vote : 1(좋아요) or -1(싫어요)
  const onVote = async (post: Post, vote: 1 | -1) => {
    if (!user?.uid) {
      setModalAtom({ open: true, view: "login" });
      return;
    }

    try {
      const { totalVote, communityId } = post;
      const existingPostVote = postVotes.find(
        (postVote) => postVote.postId === post.id
      );
      const updatedPost = { ...post };
      const updatedPosts = [...posts];
      let updatedPostVotes = [...postVotes];
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

          const voteIndex = postVotes.findIndex(
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
      const postIndex = posts.findIndex((item) => item.id === post.id);
      updatedPosts[postIndex!] = updatedPost;

      setPost(updatedPost);
      setPosts(updatedPosts);
      setPostVotes(updatedPostVotes);

      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { totalVote: totalVote + totalVoteChange });

      await batch.commit();
    } catch (error) {
      console.log("onVote Error", error);
    }
  };

  const savePostIds = async (postId: string) => {
    let updatedSavedPostIds = [];

    try {
      if (!savedPostIds?.length) {
        await updateDoc(doc(firestore, `users/${user?.uid}`), {
          savedPostIds: [postId],
        });
        setSavedPostIds([postId] as String[]);
        return;
      }

      savedPostIds?.includes(postId)
        ? (updatedSavedPostIds = savedPostIds?.filter((id) => id !== postId))
        : (updatedSavedPostIds = [...savedPostIds, postId]);

      await updateDoc(doc(firestore, `users/${user?.uid}`), {
        savedPostIds: updatedSavedPostIds,
      });

      setSavedPostIds(updatedSavedPostIds as String[]);
    } catch (error) {
      console.log("savePost error", error);
    }
  };

  const getSavedPostIds = async () => {
    try {
      const userInfo = await getDoc(doc(firestore, `users/${user?.uid}`));
      setSavedPostIds(userInfo.data()?.savedPostIds);
    } catch (error) {
      console.log("getSavedPost error", error);
    }
  };

  const sharePostIds = async (postId: string) => {
    let updatedSharedPostIds = [];

    try {
      if (!sharedPostIds?.length) {
        await updateDoc(doc(firestore, `users/${user?.uid}`), {
          sharedPostIds: [postId],
        });
        setSharedPostIds([postId] as String[]);
        return;
      }

      sharedPostIds?.includes(postId)
        ? (updatedSharedPostIds = sharedPostIds?.filter((id) => id !== postId))
        : (updatedSharedPostIds = [...sharedPostIds, postId]);

      await updateDoc(doc(firestore, `users/${user?.uid}`), {
        sharedPostIds: updatedSharedPostIds,
      });

      setSharedPostIds(updatedSharedPostIds as String[]);
    } catch (error) {
      console.log("sharedPost error", error);
    }
  };

  const getSharedPostIds = async () => {
    try {
      const userInfo = await getDoc(doc(firestore, `users/${user?.uid}`));
      setSharedPostIds(userInfo.data()?.sharedPostIds);
    } catch (error) {
      console.log("getSharedPost error", error);
    }
  };


  return {
    getHomeFeed,
    getCommunityFeed,
    getBookmarkFeed,
    getPost,
    createPost,
    deletePost,
    selectPost,
    onVote,
    savePostIds,
    getSavedPostIds,
    sharePostIds,
    getSharedPostIds,
    posts,
    postVotes,
    savedPostIds,
    sharedPostIds,
    loading,
    error,
    last,
  };
};

export default usePost;
