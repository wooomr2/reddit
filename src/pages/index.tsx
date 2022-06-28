import { Stack } from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../atoms/communityAtom";
import { Post, PostVote } from "../atoms/postAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import Recommendation from "../components/Community/Recommendation";
import PageContent from "../components/Layout/PageContent";
import PostItem from "../components/Post/PostItem";
import PostLoader from "../components/Post/PostLoader";
import { auth, firestore } from "../firebase/clientApp";
import useCommunity from "../hooks/useCommunity";
import usePost from "../hooks/usePost";

const Home: NextPage = () => {
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { postItems, setPostItems, onVote, onSelectPost, onDeletePost } =
    usePost();
  // const mySnippets = useRecoilValue(communityState);
  const { mySnippets } = useCommunity();

  const buildUserHomeFeed = async () => {
    setLoading(true);
    try {
      if (mySnippets.communitySnippets.length) {
        const myCommunityIds = mySnippets.communitySnippets.map(
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

        setPostItems((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log("buildUserHomeFeed error", error);
    }
    setLoading(false);
  };

  const buildNoUserHomeFeed = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("totalVote", "desc"),
        limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostItems((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log("buildNoUserHomeFeed error", error);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {
    setLoading(true);
    try {
      const postIds = postItems.posts.map((post) => post.id);
      const postVotesQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where("postId", "in", postIds)
      );

      const postVotesDocs = await getDocs(postVotesQuery);
      const postVotes = postVotesDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostItems((prev) => ({
        ...prev,
        postVotes: postVotes as PostVote[],
      }));
    } catch (error) {
      console.log("getUserPostVotes", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (mySnippets.isSnippetsFetched) buildUserHomeFeed();
  }, [mySnippets.isSnippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed();
  }, [user, loadingUser]);

  useEffect(() => {
    if (user && postItems.posts.length) getUserPostVotes();

    return () => {
      setPostItems((prev) => ({
        ...prev,
        postVotes: [],
      }));
    };
  }, [user, postItems.posts.length]);

  return (
    <PageContent>
      <>
        <CreatePostLink />
        {/* PostFeed */}
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postItems.posts.map((post, i) => (
              <PostItem
                key={post.id}
                post={post}
                userIsCreator={user?.uid === post.creatorId}
                userVote={
                  postItems.postVotes.find(
                    (postVote) => postVote.postId === post.id
                  )?.vote
                }
                onVote={onVote}
                onDeletePost={onDeletePost}
                onSelectPost={onSelectPost}
                isHomePage={true}
              />
            ))}
          </Stack>
        )}
      </>
      <>
        {/* Recommendation */}
        <Recommendation />
      </>
    </PageContent>
  );
};

export default Home;

// 커뮤니티 이미지 변경 즉각반영안됨!!!!
