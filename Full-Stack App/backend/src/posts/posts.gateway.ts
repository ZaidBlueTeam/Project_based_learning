import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PostsService } from './posts.service';

@WebSocketGateway()
export class PostsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly postsService: PostsService) {}

  @SubscribeMessage('createPost')
  async handleCreatePost(@MessageBody() data: any) {
    const post = await this.postsService.create(data);
    this.server.emit('postCreated', post);
    return post;
  }

  @SubscribeMessage('updatePost')
  async handleUpdatePost(@MessageBody() data: { id: string; updateData: any }) {
    const post = await this.postsService.update(data.id, data.updateData);
    this.server.emit('postUpdated', post);
    return post;
  }

  @SubscribeMessage('deletePost')
  async handleDeletePost(@MessageBody() data: { id: string }) {
    await this.postsService.remove(data.id);
    this.server.emit('postDeleted', { id: data.id });
    return { id: data.id };
  }
}