import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/prisma.service';
import { Post, Prisma, Reaction, ReactionType, User } from '@prisma/client';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { StorageService } from 'src/modules/storage/storage.service';
import { FilterPostsDto } from '../dto/filter-posts.dto';
import { serializePost } from 'src/common/libs/serialize-post';
import {
  PaginatedPostResponse,
  PostResponse,
} from 'src/common/interfaces/post-response.interface';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: User,
    uploads: { images?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ): Promise<PostResponse> {
    const { tagIds, content } = createPostDto;

    // Tags validation
    await this.validateTags(tagIds, user.tagId);

    // Upload images and file, if exists
    const { imageUrls, file } = await this.handleUploads(uploads);

    const { fileName, fileUrl, postUploads, ...rest } =
      await this.prisma.post.create({
        data: {
          content,
          ...(imageUrls.length > 0 && {
            postUploads: {
              create: imageUrls.map((el) => ({
                url: el.url,
                name: el.fileName,
                size: el.fileSize,
                mimeType: el.mimeType,
              })),
            },
          }),
          ...(file && {
            fileUrl: file.url,
            fileName: file.fileName,
          }),
          user: {
            connect: { id: user.id },
          },
          tags: {
            connect: tagIds.map((tagId) => ({ id: tagId })),
          },
        },
        select: {
          id: true,
          content: true,
          fileUrl: true,
          fileName: true,
          createdAt: true,
          updatedAt: true,
          tags: {
            select: { id: true, name: true },
          },
          user: {
            select: {
              id: true,
              username: true,
              photoUrl: true,
              firstName: true,
              lastName: true,
            },
          },
          postUploads: {
            select: {
              url: true,
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

    if (!rest)
      throw new BadRequestException(
        'something went wrong while creating the post',
      );

    return {
      ...rest,
      file: { name: fileName, url: fileUrl },
      images: postUploads.map(({ name, url }) => ({
        name,
        url,
      })),
    };
  }

  async findAll(
    user: User,
    paginationOptions: { skip: number; take: number },
    filteringOptions: { tagId: number },
    { page, limit }: FilterPostsDto,
  ): Promise<PaginatedPostResponse> {
    const tagId = filteringOptions.tagId || user.tagId;

    const whereCondition = {
      tags: {
        some: { id: tagId },
      },
    };

    const total = await this.prisma.post.count({
      where: whereCondition,
    });

    const posts = await this.prisma.post.findMany({
      where: whereCondition,
      select: {
        id: true,
        content: true,
        postUploads: true,
        fileUrl: true,
        fileName: true,
        createdAt: true,
        updatedAt: true,
        tags: { select: { id: true, name: true } },
        user: {
          select: {
            username: true,
            id: true,
            photoUrl: true,
            firstName: true,
            lastName: true,
          },
        },
        reactions: {
          take: 3,
          select: {
            id: true,
            type: true,
            user: {
              select: {
                id: true,
                username: true,
                photoUrl: true,
              },
            },
          },
          distinct: ['type'],
        },
        SavedPost: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
          },
          take: 1,
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...paginationOptions,
    });

    const data = await Promise.all(
      posts.map(async (post) => {
        const isReacted = await this.prisma.reaction.findFirst({
          where: { userId: user.id, postId: post.id },
        });
        const readyPost = {
          ...serializePost(post),
          isSaved: post.SavedPost.length > 0,
          isReacted: isReacted ? true : false,
          reactionType: isReacted?.type || null,
        };
        return readyPost;
      }),
    );

    return {
      data,
      meta: {
        page,
        limit,
        PagesCount: Math.ceil(total / limit),
        total,
      },
    };
  }

  async findOne(id: number, user: User): Promise<PostResponse> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        postUploads: true,
        fileUrl: true,
        fileName: true,
        createdAt: true,
        updatedAt: true,
        tags: { select: { id: true, name: true } },
        user: {
          select: {
            username: true,
            id: true,
            photoUrl: true,
            firstName: true,
            lastName: true,
          },
        },
        reactions: {
          take: 3,
          select: {
            id: true,
            type: true,
            user: {
              select: {
                id: true,
                username: true,
                photoUrl: true,
              },
            },
          },
          distinct: ['type'],
        },
        ...(user && {
          SavedPost: {
            where: {
              userId: user.id,
            },
            select: {
              id: true,
            },
            take: 1,
          },
        }),
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
    });
    if (!post) throw new BadRequestException(`No post with this Id: ${id}`);

    const isReacted = await this.prisma.reaction.findFirst({
      where: { userId: user.id, postId: post.id },
    });
    return {
      ...serializePost(post),
      isSaved: post?.SavedPost.length > 0,
      isReacted: isReacted ? true : false,
      reactionType: isReacted?.type || null,
    };
  }

  async reactToPost(id: number, user: User, type: ReactionType) {
    // check if the user has already reacted to the post
    const existingReaction = await this.prisma.reaction.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: id,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // If the reaction type is the same, delete the reaction (toggle off)
        await this.prisma.reaction.delete({
          where: {
            id: existingReaction.id,
          },
        });
        return { message: 'Reaction removed' };
      } else {
        // If the reaction type is different, update the reaction

        const updatedReaction = await this.prisma.reaction.update({
          where: {
            id: existingReaction.id,
          },
          data: {
            type,
          },
        });
        return updatedReaction;
      }
    } else {
      // If no existing reaction, create a new one
      const newReaction = await this.prisma.reaction.create({
        data: {
          type,
          user: {
            connect: { id: user.id },
          },
          post: {
            connect: { id },
          },
        },
      });
      return newReaction;
    }
  }

  async getPostReactions(
    postId: number,
    type: ReactionType,
    paginationOptions: { skip: number; take: number },
    { page, limit }: { page: number; limit: number },
  ) {
    const whereCondition = {
      postId,
      type,
    };

    const total = await this.prisma.reaction.count({
      where: whereCondition,
    });

    const data = await this.prisma.reaction.findMany({
      where: whereCondition,
      select: {
        id: true,
        type: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
      },
      ...paginationOptions,
    });

    const stat = await this.getReactionsStats(postId);

    return {
      data,
      stat,
      meta: {
        page,
        limit,
        PagesCount: Math.ceil(total / limit),
        total,
      },
    };
  }

  //! Helper Functions
  private async validateTags(tagIds: number[], userTagId: number) {
    // Get user's tag info
    const userTag = await this.prisma.tag.findUnique({
      where: { id: userTagId },
      select: {
        id: true,
        collegeEn: true,
        name: true,
      },
    });

    if (!userTag) {
      throw new BadRequestException("User's tag not found");
    }

    if (tagIds.length === 0) {
      throw new BadRequestException('Please provide at least one tag');
    }

    // Validate tags
    const tags = await this.prisma.tag.findMany({
      where: { id: { in: tagIds } },
    });

    if (tags.length !== tagIds.length) {
      throw new BadRequestException(
        'Tags not valid, please provide valid tags',
      );
    }

    const invalidTags = tags.filter(
      (tag) => tag.collegeEn !== userTag.collegeEn,
    );
    if (invalidTags.length > 0) {
      throw new BadRequestException(
        `All tags must be from the same college as the user's tag (${userTag.name})`,
      );
    }
  }

  private async handleUploads(uploads: {
    images?: Express.Multer.File[];
    file?: Express.Multer.File[];
  }) {
    const imageUrls =
      uploads && uploads.images
        ? await this.storageService.uploadImages(uploads.images)
        : [];
    const file =
      uploads && uploads.file
        ? await this.storageService.uploadPDF(uploads.file[0])
        : null;
    return { imageUrls, file };
  }
  async getReactionsStats(postId: number) {
    const typesCount = await this.prisma.reaction.groupBy({
      by: ['type'],
      where: { postId },
      _count: {
        type: true,
      },
    });

    const stat = typesCount.reduce((acc, el) => {
      acc[el.type] = el._count.type;
      return acc;
    }, {});

    return stat;
  }
  // private readonly postSelect = {
  
  //   id: true,
  //   content: true,
  //   postUploads: true,
  //   fileUrl: true,
  //   fileName: true,
  //   createdAt: true,
  //   updatedAt: true,
  //   tags: {
  //     select: {
  //       id: true,
  //       name: true,
  //     },
  //   },
  //   user: {
  //     select: {
  //       username: true,
  //       id: true,
  //       photoUrl: true,
  //       firstName: true,
  //       lastName: true,
  //     },
  //   },
  //   reactions: {
  //     take: 3,
  //     select: {
  //       id: true,
  //       type: true,
  //       user: {
  //         select: {
  //           id: true,
  //           username: true,
  //           photoUrl: true,
  //         },
  //       },
  //     },
  //     distinct: ['type'],
  //   },
  //   _count: {
  //     select: {
  //       reactions: true,
  //       comments: true,
  //     },
  //   },
  // } as const;
}
