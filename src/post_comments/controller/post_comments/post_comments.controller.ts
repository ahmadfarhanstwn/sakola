import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostCommentsService } from '../../service/post_comments/post_comments.service';

@Controller('post-comments')
export class PostCommentsController {
  constructor(private readonly postCommentService: PostCommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/comments/:post_id')
  async getPostComments(@Param() param) {
    return await this.postCommentService.getComments(param.post_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createPostComment(@Req() req) {
    return await this.postCommentService.createPostComment(
      req.post_id,
      req.user.id,
      req.comment,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/comment/:comment_id')
  async getComment(@Param() param) {
    return await this.postCommentService.getComment(param.comment_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/:comment_id')
  async editComment(@Param() param, @Req() req) {
    return await this.postCommentService.editComment(
      param.comment_id,
      req.new_comment,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:comment_id')
  async deleteComment(@Param() param, @Req() req) {
    return await this.postCommentService.deleteComment(
      param.comment_id,
      req.user.id,
    );
  }
}
