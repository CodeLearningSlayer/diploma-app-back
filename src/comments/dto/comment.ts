export interface LeaveCommentDto {
  postId: number;
  profileId: number;
  text: string;
}

export interface EditCommentDto {
  commentId: number;
  text: string;
}
