import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import router from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  communitySnippetsState,
  communityState,
  isSnippetFetchedState,
} from "../atoms/communityAtom";
import { modalState } from "../atoms/modalAtom";
import { auth, firestore, storage } from "../firebase/clientApp";
import { Community } from "../models/Community";
import { CommunitySnippet } from "../models/User/CommunitySnippet";

const useCommunity = () => {
  const [user] = useAuthState(auth);
  const setModalAtom = useSetRecoilState(modalState);
  const [community, setCommunity]= useRecoilState(communityState);
  const [communitySnippets, setCommunitySnippets] = useRecoilState(communitySnippetsState);
  const [isSnippetFetched, setIsSnippetFetched] = useRecoilState(isSnippetFetchedState);
  const [loadingSnippets, setLoadingSnippets] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const getCommunitySnippets = async () => {
    setLoadingSnippets(true);

    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunitySnippets(snippets);
      setIsSnippetFetched(true);

    } catch (error: any) {
      console.log("getCommunitySnippets error", error);
      setError(error.message);
    }
    
    setLoadingSnippets(false);
  };

  const getCommunities = async (
    setCommunities: React.Dispatch<React.SetStateAction<Community[]>>,
    lim: number
  ) => {
    setLoading(true)
    try {
      const q = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc"),
        limit(lim)
      );
      const communityDocs = await getDocs(q);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Community[];

      setCommunities(communities);
    } catch (error) {
      console.log("getCommunityRecommendation error", error);
    }
    setLoading(false)
  };

  const getCommunity = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);

      setCommunity({
        id: communityDoc.id,
        ...communityDoc.data(),
      } as Community);

    } catch (error) {
      console.log("getCommunity error", error);
    }
  };

  const createCommunity = async (
    communityName: string,
    communityType: string,
    handleClose: () => void
  ) => {
    try {
      const communityDocRef = doc(firestore, "communities", communityName);

      const newSnippet: CommunitySnippet = {
        communityId: communityName,
        isModerator: true,
      };

      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);

        if (communityDoc.exists()) {
          throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
        }

        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          numberOfMembers: 1,
          privacyType: communityType,
          createdAt: serverTimestamp(),
        });
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          newSnippet
        );
      });

      setCommunitySnippets((prev) => [...prev, newSnippet]);

      router.push(`/r/${communityName}`);

      handleClose();
    } catch (error: any) {
      console.log("Transaction Error", error);
    }
  };

  const updateCommunityImage = async (
    communityId: string,
    selectedFile?: string | undefined
  ) => {
    if (!selectedFile) return;
    try {
      const imageRef = ref(storage, `communities/${communityId}/image`);

      await uploadString(imageRef, selectedFile, "data_url");

      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(firestore, "communities", communityId), {
        imageURL: downloadURL,
      });

      await updateDoc(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityId),
        {
          imageURL: downloadURL,
        }
      );

      setCommunitySnippets((prev) =>
        prev.map((snippet) =>
          snippet.communityId === communityId
            ? { ...snippet, imageURL: downloadURL }
            : snippet
        )
      );
      setCommunity((prev) => ({ ...prev, imageURL: downloadURL } as Community));

    } catch (error: any) {
      console.log("updateImage error", error.message);
    }
  };

  const joinOrLeaveCommunity = (community: Community, isJoined: boolean) => {
    if (!user) {
      setModalAtom({ open: true, view: "login" });
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
      setCommunitySnippets((prev) => [...prev, newSnippet]);

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
      setCommunitySnippets((prev) =>
        prev.filter((snippet) => snippet.communityId !== communityId)
      );

    } catch (error: any) {
      console.log("leaveCommunity error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  return {
    getCommunitySnippets,
    getCommunities,
    getCommunity,
    createCommunity,
    updateCommunityImage,
    joinOrLeaveCommunity,
    community,
    communitySnippets,
    isSnippetFetched,
    loadingSnippets,
    loading,
    error,
  };
};
export default useCommunity;
