import {
  Injectable,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseService {
  private supabase;
  private bucket = 'shrirama_image';

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );
  }

  async uploadToSupabase(fileBuffer: Buffer, userId: number) {
    const fileName = `${uuidv4()}.webp`; // Save as .webp
    const filePath = `images/${fileName}`;
    const altText = this.generateAltText(fileName);

    // Convert to .webp and compress using gm
    const compressedBuffer = await this.compressImage(fileBuffer);

    console.log('Compressed Buffer Size:', compressedBuffer.length); // Log compressed file details

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, compressedBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) {
      throw new HttpException(
        {
          statusCode: error.statusCode || 400,
          message: error.message || 'Failed to upload image to Supabase',
          details: error, // Attach full error details for debugging
        },
        error.statusCode || 400,
      );
    }

    console.log('File uploaded to Supabase:', filePath); // Log success details

    return this.prisma.images.create({
      data: {
        file_path: filePath,
        alt_text: altText,
        created_by: userId,
        created_at: new Date(),
      },
    });
  }

  async updateImage(imageId: number, fileBuffer: Buffer, userId: number) {
    const fileName = `${uuidv4()}.webp`; // Save as .webp
    const filePath = `images/${fileName}`;
    const altText = this.generateAltText(fileName);

    // Convert to .webp and compress using gm
    const compressedBuffer = await this.compressImage(fileBuffer);

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, compressedBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) {
      throw new BadRequestException('Failed to upload image to Supabase');
    }

    return this.prisma.images.update({
      where: { image_id: imageId },
      data: {
        file_path: filePath,
        alt_text: altText,
        modified_by: userId,
        modified_at: new Date(),
      },
    });
  }

  private async compressImage(fileBuffer: Buffer): Promise<Buffer> {
    const gm = (await import('gm')).subClass({ imageMagick: true }); // Dynamically import gm
    return new Promise((resolve, reject) => {
      gm(fileBuffer)
        .setFormat('webp') // Convert to webp
        .quality(80) // Set quality to 80
        .toBuffer((err, buffer) => {
          if (err) {
            return reject(new Error(`Image processing failed: ${err.message}`));
          }
          resolve(buffer);
        });
    });
  }

  private generateAltText(fileName: string): string {
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    return nameWithoutExtension.replace(/[_-]/g, ' ');
  }

  getPublicUrl(filePath: string): string {
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/${this.bucket}/${filePath}`;
  }

  async getImagesBatch(limit: number, page: number) {
    const skip = (page - 1) * limit;
    return this.prisma.images.findMany({
      skip,
      take: limit,
    });
  }

  async deleteImage(imageId: number) {
    const imageRecord = await this.prisma.images.findUnique({
      where: { image_id: imageId },
    });

    if (!imageRecord) {
      throw new NotFoundException('Image not found');
    }

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([imageRecord.file_path]);

    if (error) {
      throw new BadRequestException('Failed to delete image from Supabase');
    }

    await this.prisma.images.delete({
      where: { image_id: imageId },
    });

    return { message: 'Image deleted successfully' };
  }
}
