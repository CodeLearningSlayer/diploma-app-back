import { Like } from 'src/likes/likes.model';
import { Comment } from 'src/comments/comments.model';

export class PostDto {
  id: number;

  text: string;

  images: string[];

  videos: Array<{ video: string; thumbnail: string }>;

  event: string;

  profileId: number;

  likes: Like[];

  comments: Comment[];

  commentsCount: number;
}
