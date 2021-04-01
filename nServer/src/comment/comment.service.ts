import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPO')
    private commentRepo: Repository<Comment>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentRepo.find();
  }
}