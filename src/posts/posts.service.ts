import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { FilesService } from 'src/files/files.service';
import { FileType } from 'src/files/files.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepository: typeof Post,
    private fileService: FilesService,
  ) {}
  async create(dto: CreatePostDto, files) {
    if (files.video) {
      await this.fileService.createFile(FileType.VIDEO, files.video);
    }
    if (files.image) {
      await this.fileService.createFile(FileType.IMAGE, files.image);
    }
    const fileName = '123123';
    const post = await this.postRepository.create({ ...dto, image: fileName });
    return post;
  }
}
