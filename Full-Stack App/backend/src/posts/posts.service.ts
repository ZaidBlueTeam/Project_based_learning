import { Injectable } from '@nestjs/common';
import { PocketBaseService } from '../pocketbase.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly pbService: PocketBaseService) {}

  async create(createPostDto: CreatePostDto): Promise<any> {
    try {
      const record = await this.pbService.client.collection('posts').create(createPostDto);
      return record;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(): Promise<any[]> {
    try {
      const records = await this.pbService.client.collection('posts').getFullList();
      return records;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      const record = await this.pbService.client.collection('posts').getOne(id);
      return record;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<any> {
    try {
      const record = await this.pbService.client.collection('posts').update(id, updatePostDto);
      return record;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: string): Promise<any> {
    try {
      await this.pbService.client.collection('posts').delete(id);
      return { message: 'Post deleted' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
