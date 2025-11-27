import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PocketBase from 'pocketbase/cjs';

@Injectable()
export class PocketBaseService {
  private pb: PocketBase;

  constructor(private configService: ConfigService) {
    this.pb = new PocketBase(this.configService.get<string>('POCKETBASE_URL', 'http://127.0.0.1:8090'));
  }

  get client() {
    return this.pb;
  }
}