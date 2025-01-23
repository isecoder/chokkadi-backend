import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { BaseService } from 'src/common/utils/base.service';

@Injectable()
export class HallsService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
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
    return await this.prisma.halls.findMany({
      include: {
        HallImages: {
          include: {
            Images: true, // Include associated images
          },
        },
      },
    });
  }

  // Get a Hall by ID
  async getHallById(hallId: number) {
    // Use BaseService to handle the database operation and throw NotFoundException if needed
    return this.handleDatabaseOperation(
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

    return await this.prisma.halls.update({
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
  }

  // Delete a Hall
  async deleteHall(hallId: number) {
    // Ensure the hall exists before deleting
    await this.handleDatabaseOperation(
      this.prisma.halls.findUnique({
        where: { hall_id: hallId },
      }),
      hallId,
      'Hall',
    );

    await this.prisma.halls.delete({
      where: { hall_id: hallId },
    });

    return { message: 'Hall deleted successfully' };
  }

  // Delete all Halls
  async deleteAllHalls() {
    await this.prisma.halls.deleteMany(); // Deletes all records in the halls table
    return { message: 'All Halls deleted successfully' };
  }
}
