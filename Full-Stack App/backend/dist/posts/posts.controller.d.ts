import { PocketBaseService } from '../pocketbase.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly pbService;
    constructor(pbService: PocketBaseService);
    create(createPostDto: CreatePostDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updatePostDto: UpdatePostDto): Promise<any>;
    remove(id: string): Promise<any>;
}
