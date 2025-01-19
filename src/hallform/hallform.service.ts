// src/hall-form/hall-form.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHallFormDto } from './dto/create-hallform.dto';
import { BaseService } from 'src/common/utils/base.service';

@Injectable()
export class HallFormService extends BaseService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // Create a new Hall form entry
  async createHallForm(createHallFormDto: CreateHallFormDto) {
    const parsedDate = new Date(createHallFormDto.date);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }

    const hall = await this.prisma.halls.findUnique({
      where: { hall_id: createHallFormDto.hallId },
    });

    if (!hall) {
      throw new NotFoundException(
        `Hall with ID ${createHallFormDto.hallId} not found`,
      );
    }

    const createdHallForm = await this.prisma.hallForm.create({
      data: {
        ...createHallFormDto,
        date: parsedDate,
      },
    });

    return { id: createdHallForm.id };
  }

  // Retrieve all Hall forms, including Hall name
  async getAllHallForms() {
    return this.prisma.hallForm.findMany({
      include: {
        hall: {
          select: {
            name: true, // Fetch only the 'name' field of the related 'Hall'
          },
        },
      },
    });
  }

  // Retrieve Hall forms by parameters
  async getHallFormsByParams(filter: any) {
    return this.prisma.hallForm.findMany({
      where: {
        OR: [
          { id: filter.id }, // Assuming id is a number
          { name: { contains: filter.name } }, // Assuming name is a string
          { mobileNumber: filter.phoneNumber }, // Assuming phoneNumber is a string
          { date: filter.date ? new Date(filter.date) : undefined }, // Assuming date is a Date
        ],
      },
      include: {
        hall: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  // Delete all Hall forms
  async deleteAllHallForms() {
    return this.prisma.hallForm.deleteMany();
  }

  // Delete a specific Hall form by ID
  async deleteHallFormById(id: number) {
    const booking = await this.prisma.hallForm.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Hall Form with ID ${id} not found`);
    }

    return this.prisma.hallForm.delete({
      where: { id },
    });
  }
}
