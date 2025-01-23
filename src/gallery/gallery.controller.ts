import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  // Create a new gallery
  @Post('create')
  async createGallery(
    @Body('title') title: string,
    @Body('imageId') imageId: number, // Accept a single image ID
  ) {
    if (!title) {
      throw new BadRequestException('Title is required.');
    }
    if (!imageId) {
      throw new BadRequestException('Image ID is required.');
    }

    return this.galleryService.createGallery(title, imageId);
  }

  // Update an existing gallery
  @Put('update/:id')
  async updateGallery(
    @Param('id') galleryId: number,
    @Body('title') title: string,
    @Body('imageId') imageId: number, // Accept a single image ID
  ) {
    if (!title) {
      throw new BadRequestException('Title is required.');
    }
    if (!imageId) {
      throw new BadRequestException('Image ID is required.');
    }

    return this.galleryService.updateGallery(galleryId, title, imageId);
  }

  // Delete a gallery by ID
  @Delete('delete/:id')
  async deleteGallery(@Param('id') galleryId: number) {
    return this.galleryService.deleteGallery(galleryId);
  }

  // Get a gallery by ID
  @Get(':id')
  async getGalleryById(@Param('id') galleryId: number) {
    return this.galleryService.getGalleryById(galleryId);
  }

  // Get all galleries
  @Get()
  async getAllGalleries() {
    return this.galleryService.getAllGalleries();
  }
}
