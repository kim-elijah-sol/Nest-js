import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostRequestDTO } from './dtos/CreatePostRequest.dto';

@Injectable()
export class PostRepository {
  constructor(private readonly prismaClient: PrismaService) {}

  async createPost({ title, content }: CreatePostRequestDTO, userIdx: number) {
    return await this.prismaClient.post.create({
      data: {
        title,
        content,
        authorId: userIdx,
      },
      select: {
        idx: true,
      },
    });
  }
}
