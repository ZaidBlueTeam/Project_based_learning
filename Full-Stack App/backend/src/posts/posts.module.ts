import { Module } from '@nestjs/common';
import { PocketBaseModule } from '../pocketbase.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsGateway } from './posts.gateway';

@Module({
  imports: [PocketBaseModule],
  controllers: [PostsController],
  providers: [PostsService, PostsGateway]
})
export class PostsModule {}
