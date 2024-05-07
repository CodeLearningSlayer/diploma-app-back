export class CreatePostDto {
  readonly userId: number;
  readonly text: string;
  readonly event?: string;
}
