import { Module } from '@nestjs/common';
import { PocketBaseModule } from '../pocketbase.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [PocketBaseModule],
  controllers: [AuthController]
})
export class AuthModule {}
