import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  // Create a gallery associated with a single image
  async createGallery(title: string, imageId: number) {
    if (!imageId) {
      throw new BadRequestException('Image ID must be provided.');
    }

    // Ensure the image exists
    const image = await this.prisma.images.findUnique({
      where: { image_id: imageId },
    });
    if (!image) {
      throw new NotFoundException('Image not found.');
    }

    // Create the gallery
    return this.prisma.gallery.create({
      data: {
        title,
        image_id: imageId, // Associate the gallery with the image
      },
      include: {
        Images: true, // Include the associated image in the response
      },
    });
  }

  // Update an existing gallery
  async updateGallery(galleryId: number, title: string, imageId: number) {
    // Check if the gallery exists
    const gallery = await this.prisma.gallery.findUnique({
      where: { gallery_id: galleryId },
    });
    if (!gallery) {
      throw new NotFoundException('Gallery not found.');
    }

    // Ensure the new image exists
    const image = await this.prisma.images.findUnique({
      where: { image_id: imageId },
    });
    if (!image) {
      throw new NotFoundException('Image not found.');
    }

    // Update the gallery
    return this.prisma.gallery.update({
      where: { gallery_id: galleryId },
      data: {
        title,
        image_id: imageId, // Update the associated image
      },
      include: {
        Images: true, // Include the associated image in the response
      },
    });
  }

  // Delete a gallery
  async deleteGallery(galleryId: number) {
    // Check if the gallery exists
    const gallery = await this.prisma.gallery.findUnique({
      where: { gallery_id: galleryId },
    });
    if (!gallery) {
      throw new NotFoundException('Gallery not found.');
    }

    // Delete the gallery
    return this.prisma.gallery.delete({
      where: { gallery_id: galleryId },
    });
  }

  // Get a gallery by ID
  async getGalleryById(galleryId: number) {
    const gallery = await this.prisma.gallery.findUnique({
      where: { gallery_id: galleryId },
      include: { Images: true }, // Include the associated image
    });

    if (!gallery) {
      throw new NotFoundException('Gallery not found.');
    }

    return gallery;
  }

  // Get all galleries
  async getAllGalleries() {
    return this.prisma.gallery.findMany({
      include: { Images: true }, // Include associated images
    });
  }
}