import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { BaseService } from 'src/common/utils/base.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class HallsService extends BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {
    super();
  }

  // Create a new Hall
  async createHall(createHallDto: CreateHallDto) {
    const {
      name,
      description,
      name_kannada,
      description_kannada,
      available,
      imageIds,
    } = createHallDto;

    if (!imageIds || imageIds.length === 0) {
      throw new BadRequestException(
        'At least one image must be associated with the hall.',
      );
    }

    return await this.prisma.halls.create({
      data: {
        name,
        description,
        name_kannada,
        description_kannada,
        available: available ?? true,
        HallImages: {
          create: imageIds.map((id) => ({ image_id: id })),
        },
      },
      include: {
        HallImages: {
          include: {
            Images: true, // Include associated images in the response
          },
        },
      },
    });
  }

  // Get all Halls
  async getAllHalls() {
    const halls = await this.prisma.halls.findMany({
      include: {
        HallImages: {
          include: {
            Images: true, // Include associated images
          },
        },
      },
    });

    // Add public_url to associated images
    return halls.map((hall) => ({
      ...hall,
      HallImages: hall.HallImages.map((hallImage) => ({
        ...hallImage,
        Images: {
          ...hallImage.Images,
          public_url: this.supabaseService.getPublicUrl(
            hallImage.Images.file_path,
          ),
        },
      })),
    }));
  }

  // Get a Hall by ID
  async getHallById(hallId: number) {
    const hall = await this.handleDatabaseOperation(
      this.prisma.halls.findUnique({
        where: { hall_id: hallId },
        include: {
          HallImages: {
            include: {
              Images: true, // Include associated images
            },
          },
        },
      }),
      hallId,
      'Hall',
    );

    // Add public_url to associated images
    return {
      ...hall,
      HallImages: hall.HallImages.map((hallImage) => ({
        ...hallImage,
        Images: {
          ...hallImage.Images,
          public_url: this.supabaseService.getPublicUrl(
            hallImage.Images.file_path,
          ),
        },
      })),
    };
  }

  // Update a Hall
  async updateHall(hallId: number, updateHallDto: UpdateHallDto) {
    // Ensure the hall exists before updating
    await this.handleDatabaseOperation(
      this.prisma.halls.findUnique({
        where: { hall_id: hallId },
      }),
      hallId,
      'Hall',
    );

    const {
      name,
      description,
      name_kannada,
      description_kannada,
      available,
      imageIds,
    } = updateHallDto;

    const updatedHall = await this.prisma.halls.update({
      where: { hall_id: hallId },
      data: {
        name,
        description,
        name_kannada,
        description_kannada,
        available,
        HallImages: imageIds
          ? {
              deleteMany: {}, // Remove existing relationships
              create: imageIds.map((id) => ({ image_id: id })),
            }
          : undefined,
      },
      include: {
        HallImages: {
          include: {
            Images: true, // Include associated images
          },
        },
      },
    });

    // Add public_url to associated images
    return {
      ...updatedHall,
      HallImages: updatedHall.HallImages.map((hallImage) => ({
        ...hallImage,
        Images: {
          ...hallImage.Images,
          public_url: this.supabaseService.getPublicUrl(
            hallImage.Images.file_path,
          ),
        },
      })),
    };
  }

  // Delete a Hall
  async deleteHall(hallId: number) {
    // Check if the hall exists
    const hall = await this.prisma.halls.findUnique({
      where: { hall_id: hallId },
      include: {
        HallImages: {
          include: {
            Images: true, // Ensure the associated images are included
          },
        },
      },
    });

    if (!hall) {
      throw new NotFoundException('Hall not found.');
    }

    // Collect all associated image IDs
    const imageIds = hall.HallImages?.map(
      (hallImage) => hallImage.Images?.image_id,
    );

    // Delete the rows in HallImages first
    await this.prisma.hallImages.deleteMany({
      where: { hall_id: hallId },
    });

    // Delete the hall next
    const deletedHall = await this.prisma.halls.delete({
      where: { hall_id: hallId },
    });

    // Delete the associated images after deleting the hall and HallImages rows
    if (imageIds && imageIds.length > 0) {
      for (const imageId of imageIds) {
        if (imageId) {
          await this.supabaseService.deleteImage(imageId);
        }
      }
    }

    return {
      message:
        'Hall, associated images, and HallImages rows deleted successfully',
      deletedHall,
    };
  }

  // Delete all Halls
  async deleteAllHalls() {
    await this.prisma.halls.deleteMany(); // Deletes all records in the halls table
    return { message: 'All Halls deleted successfully' };
  }
}
