import { atom } from "recoil";

export interface Modal {
  open: boolean;
  view: "login" | "signup" | "resetPassword";
}

const defaultModalState: Modal = {
  open: false,
  view: "login",
};

export const modalState = atom<Modal>({
  key: "modalState",
  default: defaultModalState,
});
