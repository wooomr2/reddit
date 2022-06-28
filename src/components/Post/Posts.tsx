import { Stack } from "@chakra-ui/react";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import { Item } from "framer-motion/types/components/Reorder/Item";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Community } from "../../atoms/communityAtom";
import { Post } from "../../atoms/postAtom";
import { auth, firestore } from "../../firebase/clientApp";
import usePost from "../../hooks/usePost";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type PostsProps = {
  community: Community;
  userId?: string;
};

const Posts: React.FC<PostsProps> = ({ community }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { postItems, setPostItems, onVote, onDeletePost, onSelectPost } =
    usePost();

  const getPosts = async () => {
    setLoading(true);
    try {
      //get posts from firestore
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", community.id),
        orderBy("createdAt", "desc")
      );
      const postDocs = await getDocs(postsQuery);

      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostItems((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error) {
      console.log("getPosts error", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, [user, router.query]);

  return (
    <>
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
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
