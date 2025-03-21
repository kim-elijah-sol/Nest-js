import { Injectable } from '@nestjs/common';
import { CreatePostRequestDTO } from './dtos/CreatePostRequest.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(request: CreatePostRequestDTO, userIdx: number) {
    return await this.postRepository.createPost(request, userIdx);
  }
}
