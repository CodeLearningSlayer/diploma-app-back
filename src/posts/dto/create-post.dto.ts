export class CreatePostDto {
  readonly text: string;
  readonly event?: string;
  readonly profileId: number;
}
