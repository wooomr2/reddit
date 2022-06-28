import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "../atoms/communityAtom";
import { modalState } from "../atoms/modalAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunity = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [modal, setModal] = useRecoilState(modalState);
  const [mySnippets, setMySnippets] = useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      //Clear user communitySnippets in recoilState
      setMySnippets((prev) => ({
        ...prev,
        communitySnippets: [],
        isSnippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setMySnippets((prev) => ({
        ...prev,
        communitySnippets: snippets as CommunitySnippet[],
        isSnippetsFetched: true,
      }));
    } catch (error: any) {
      console.log("getMySnippets error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const { communityId } = router.query;
    if (communityId && !mySnippets.currentCommunity) {
      getCommunity(communityId as string);
    }
  }, [router.query, mySnippets.currentCommunity]);

  const getCommunity = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);

      setMySnippets((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error) {
      console.log("getCommunity error", error);
    }
  };

  const onJoinOrLeaveCommunity = (community: Community, isJoined: boolean) => {
    if (!user) {
      setModal({ open: true, view: "login" });
      return;
    }
    if (isJoined) {
      leaveCommunity(community.id);
      return;
    }
    joinCommunity(community);
  };

  const joinCommunity = async (community: Community) => {
    setLoading(true);

    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: community.id,
        imageURL: community.imageURL || "",
        // isModerator: user?.uid === community.creatorId,
      };

      // 유저 creating a new communitySnippet
      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippets`, community.id),
        newSnippet
      );

      // updating numberOfMembers +1
      batch.update(doc(firestore, "communities", community.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update recoilState
      setMySnippets((prev) => ({
        ...prev,
        communitySnippets: [...prev.communitySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("joinCommunity error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    setLoading(true);

    try {
      const batch = writeBatch(firestore);

      // deleting communitySnippet
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets/${communityId}`)
      );

      // updating numberOfMembers -1
      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      // update recoilState
      setMySnippets((prev) => ({
        ...prev,
        communitySnippets: prev.communitySnippets.filter(
          (snippet) => snippet.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("leaveCommunity error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  return {
    onJoinOrLeaveCommunity,
    mySnippets,
    loading,
    error,
  };
};
export default useCommunity;
