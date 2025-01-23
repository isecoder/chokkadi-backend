import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';

@Module({
  providers: [GalleryService, PrismaService],
  controllers: [GalleryController],
})
export class GalleryModule {}
