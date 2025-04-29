import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService,
  ) {}

  create(createPostDto: CreatePostDto & { authorId: string }) {
    const ability = this.abilityService.ability;

    if (!ability.can('create', 'Post')) {
      throw new Error('You do not have permission to create a user');
    }

    return this.prismaService.post.create({
      data: createPostDto,
    });
  }

  findAll() {
    const ability = this.abilityService.ability;
    
    return this.prismaService.post.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').Post],
      },
    });
  }

  findOne(id: string) {
    const ability = this.abilityService.ability;

    return this.prismaService.post.findUnique({
      where: {
        id,
        AND: [accessibleBy(ability, 'read').Post],
      },
    });
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.prismaService.post.update({
      where: {
        id,
      },
      data: updatePostDto,
    });
  }

  remove(id: string) {
    return this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }
}
