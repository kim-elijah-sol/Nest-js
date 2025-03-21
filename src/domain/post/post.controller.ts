import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TokenInfoDTO } from 'src/auth/dtos/TokenInfo.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { TokenInfo } from 'src/decorator';
import { CreatePostRequestDTO } from './dtos/CreatePostRequest.dto';
import { PostService } from './post.service';

@Controller('/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Post()
  @HttpCode(200)
  async createPost(
    @TokenInfo() tokenInfo: TokenInfoDTO,
    @Body() createPostRequestDTO: CreatePostRequestDTO,
  ) {
    const result = await this.postService.createPost(
      createPostRequestDTO,
      tokenInfo.idx,
    );

    if (!result) {
      throw new InternalServerErrorException();
    }

    return {
      statusCode: 200,
      success: true,
      data: {
        postIdx: result.idx,
      },
    };
  }
}
