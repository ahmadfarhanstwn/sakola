import {
  Controller,
  UseGuards,
  Post,
  Req,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  ParseUUIDPipe,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import {
  createPostDto,
  createPostSchema,
  updatePostDto,
  updatePostSchema,
} from '../../dto/posts.dto';
import { PostsService } from '../../../posts/service/posts/posts.service';
import JwtGuard from '../../../../auth/jwt.guard';
import { JoiValidationPipe } from '../../../../pipes/joi_validation.pipe';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(JwtGuard)
  @UsePipes(new JoiValidationPipe(createPostSchema))
  @Post('')
  async createPost(@Req() req, @Body() inputDto: createPostDto) {
    return await this.postService.createPost(
      req.user.id,
      inputDto.classroom_id,
      inputDto.title,
      inputDto.body,
    );
  }

  @UseGuards(JwtGuard)
  @Get(':classroom_id')
  async getPosts(
    @Param(
      'classroom_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    classroom_id: number,
  ) {
    return await this.postService.getPosts(classroom_id);
  }

  @UseGuards(JwtGuard)
  @Get(':classroom_id/:post_id')
  async getPost(
    @Param(
      'classroom_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    classroom_id: number,
    @Param(
      'post_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    post_id: number,
  ) {
    return await this.postService.getPost(post_id);
  }

  @UseGuards(JwtGuard)
  @UsePipes(new JoiValidationPipe(updatePostSchema))
  @Patch(':classroom_id/:post_id')
  async updatePost(
    @Param(
      'classroom_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    classroom_id: number,
    @Param(
      'post_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    post_id: number,
    @Req()
    req,
    @Body() inputDto: updatePostDto,
  ) {
    return await this.postService.updatePost(
      req.user.userId,
      post_id,
      inputDto.title,
      inputDto.body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':classroom_id/:post_id')
  async deletePost(
    @Param(
      'classroom_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    classroom_id: number,
    @Param(
      'post_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    post_id: number,
    @Req() req,
  ) {
    return await this.postService.deletePost(req.user.id, post_id);
  }
}
