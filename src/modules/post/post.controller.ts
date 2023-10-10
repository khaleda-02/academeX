import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UserIdentity } from 'src/common/decorators/user.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @UserIdentity() user) {
    return this.postService.create(createPostDto, user.id);
  }

  // profile posts
  @Get()
  getUserPosts(@UserIdentity() user) {
    return this.postService.getUserPosts(user.id);
  }
  
  @Get(':id')
  getUserPost(@Param('id', ParseIntPipe) id: number, @UserIdentity() user) {
    return this.postService.getUserPost(id, user.id);
  }
  
  // home page posts
  @Get()
  getHomePosts(@UserIdentity() user) {
    return this.postService.getHomePosts(user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }

  // getHomePosts based on the user's interests : hashtags
  // getHomePosts(){} , getHashTagPosts(){}
}
