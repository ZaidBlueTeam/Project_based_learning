import { Module } from '@nestjs/common';
import { PocketBaseModule } from '../pocketbase.module';
import { PostsController } from './posts.controller';

@Module({
  imports: [PocketBaseModule],
  controllers: [PostsController]
})
export class PostsModule {}
