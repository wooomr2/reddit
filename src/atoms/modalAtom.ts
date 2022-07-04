import { atom } from "recoil";

export interface ModalAtom {
  open: boolean;
  view: "login" | "signup" | "resetPassword" | "createCommunity";
}

const defaultModalState: ModalAtom = {
  open: false,
  view: "login",
};

export const modalState = atom<ModalAtom>({
  key: "modalState",
  default: defaultModalState,
});