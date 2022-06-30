export type PostVote = {
  id?: string;
  postId: string;
  communityId: string;
  vote: 1 | -1;
};