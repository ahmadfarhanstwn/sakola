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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { createPostDto, updatePostDto } from '../../dto/posts.dto';
import { PostsService } from '../../../posts/service/posts/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createPost(@Req() req, @Body() inputDto: createPostDto) {
    return await this.postService.createPost(
      req.user.id,
      inputDto.classroom_id,
      inputDto.title,
      inputDto.body,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':classroom_id')
  async getPosts(@Param() param, @Req() req) {
    return await this.postService.getPosts(param.classroom_id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':classroom_id/:post_id')
  async getPost(@Param() param, @Req() req) {
    return await this.postService.getPost(
      param.classroom_id,
      req.user.id,
      param.post_id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':classroom_id/:post_id')
  async updatePost(
    @Param() param,
    @Req() req,
    @Body() inputDto: updatePostDto,
  ) {
    return await this.postService.updatePost(
      param.classroom_id,
      req.user.id,
      param.post_id,
      inputDto.title,
      inputDto.body,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':classroom_id/:post_id')
  async deletePost(@Param() param, @Req() req) {
    return await this.postService.deletePost(
      param.classroom_id,
      req.user.id,
      param.post_id,
    );
  }
}
