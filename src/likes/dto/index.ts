export interface LikePostDto {
  postId: number;
  profileId: number;
}

export interface DeleteLikePostDto extends LikePostDto {}
