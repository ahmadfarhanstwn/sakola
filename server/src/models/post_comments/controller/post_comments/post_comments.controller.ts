import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Req,
  Patch,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import JwtGuard from '../../../../auth/jwt.guard';
import { PostCommentsService } from '../../service/post_comments/post_comments.service';

@Controller('post-comments')
export class PostCommentsController {
  constructor(private readonly postCommentService: PostCommentsService) {}

  @UseGuards(JwtGuard)
  @Get(':post_id')
  async getPostComments(
    @Param(
      'post_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    post_id: number,
  ) {
    return await this.postCommentService.getComments(post_id);
  }

  @UseGuards(JwtGuard)
  @Post('')
  async createPostComment(@Req() req) {
    return await this.postCommentService.createPostComment(
      req.post_id,
      req.user.id,
      req.comment,
    );
  }

  @UseGuards(JwtGuard)
  @Get('detail/:comment_id')
  async getComment(
    @Param(
      'comment_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    comment_id: number,
  ) {
    return await this.postCommentService.getComment(comment_id);
  }

  @UseGuards(JwtGuard)
  @Patch('detail/:comment_id')
  async editComment(
    @Param(
      'comment_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    comment_id: number,
    @Req() req,
  ) {
    return await this.postCommentService.editComment(
      comment_id,
      req.new_comment,
      req.user.id,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('detail/:comment_id')
  async deleteComment(
    @Param(
      'comment_id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    param,
    @Req() req,
  ) {
    return await this.postCommentService.deleteComment(
      param.comment_id,
      req.user.id,
    );
  }
}
