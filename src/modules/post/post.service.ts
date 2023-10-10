import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { POST_REPOSITORY } from 'src/common/constants';
import { Post } from './models/post.model';

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_REPOSITORY)
    private postRepository: typeof Post,
  ) {}
  async create(createPostDto: CreatePostDto, userId: number) {
    const post = await this.postRepository.create({
      ...createPostDto,
      userId,
    });
    return post.get({ plain: true });
  }

  async getUserPosts(userId: number) {
    const posts = await this.postRepository.scope('withUser').findAll({
      where: { userId },
    });
    return posts;
  }

  async getUserPost(id: number, userId: number) {
    const post = await this.postRepository.scope('withUser').findOne({
      where: { id, userId },
    });
    return post;
  }

  async getHomePosts(userId: number) {
    // get the interests tags, filter the posts based on the tags . return it to user  
    const posts = await this.postRepository.scope('withUser').findAll();
    return posts;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
