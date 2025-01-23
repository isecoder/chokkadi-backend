// src/halls/halls.module.ts
import { Module } from '@nestjs/common';
import { HallsController } from './halls.controller';
import { HallsService } from './halls.service';
import { PrismaService } from '../prisma/prisma.service';
import { HallFormModule } from 'src/hallform/hallform.module';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  imports: [HallFormModule],
  controllers: [HallsController],
  providers: [HallsService, PrismaService, SupabaseService],
})
export class HallsModule {}
