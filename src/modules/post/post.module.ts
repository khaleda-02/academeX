import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { postProviders } from './post.providers';

@Module({
  controllers: [PostController],
  providers: [PostService, ...postProviders],
})
export class PostModule {}
