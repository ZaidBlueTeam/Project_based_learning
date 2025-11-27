import { ConfigService } from '@nestjs/config';
import PocketBase from 'pocketbase/cjs';
export declare class PocketBaseService {
    private configService;
    private pb;
    constructor(configService: ConfigService);
    get client(): PocketBase;
}
