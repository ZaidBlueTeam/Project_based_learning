import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PocketBaseService } from '../pocketbase.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RecordModel } from 'pocketbase';

@Controller('posts')
export class PostsController {
  constructor(private readonly pbService: PocketBaseService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<any> {
    try {
      const record = await this.pbService.client.collection('posts').create(createPostDto);
      return record;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get()
  async findAll(): Promise<any[]> {
    try {
      const records = await this.pbService.client.collection('posts').getFullList();
      return records;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const record = await this.pbService.client.collection('posts').getOne(id);
      return record;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<any> {
    try {
      const record = await this.pbService.client.collection('posts').update(id, updatePostDto);
      return record;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    try {
      await this.pbService.client.collection('posts').delete(id);
      return { message: 'Post deleted' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
