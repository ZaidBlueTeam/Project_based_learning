import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PocketBaseService } from './pocketbase.service';

@Module({
  imports: [ConfigModule],
  providers: [PocketBaseService],
  exports: [PocketBaseService],
})
export class PocketBaseModule {}