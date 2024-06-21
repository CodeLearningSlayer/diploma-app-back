export class CreatePostDto {
  readonly text: string;
  readonly img: string[];
  readonly video: {
    video: string;
    thumbnail: string;
  }[];
  readonly event?: string;
  readonly profileId: number;
}
