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

  // Create a new Hall form entry with duplicate booking prevention
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

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if the hall is already unavailable (booked or admin-disabled)
    const existingAvailability = await this.prisma.hallAvailability.findFirst({
      where: {
        hall_id: createHallFormDto.hallId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        is_booked: true,
      },
    });

    if (existingAvailability) {
      throw new BadRequestException(
        `The hall is already unavailable for the selected date.`,
      );
    }

    // Check if the hall is disabled for the selected date
    const disabledAvailability = await this.prisma.hallAvailability.findFirst({
      where: {
        hall_id: createHallFormDto.hallId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        is_booked: false,
      },
    });

    if (disabledAvailability) {
      throw new BadRequestException(
        `The hall is disabled for the selected date due to: ${disabledAvailability.reason}`,
      );
    }

    // Mark the hall as booked in the availability table
    await this.prisma.hallAvailability.create({
      data: {
        hall_id: createHallFormDto.hallId,
        date: startOfDay,
        is_booked: true,
        reason: `Booked by ${createHallFormDto.name}`,
      },
    });

    // Create the hall form entry
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

    // Remove the corresponding availability entry
    await this.prisma.hallAvailability.deleteMany({
      where: {
        hall_id: booking.hallId,
        date: booking.date,
      },
    });

    return this.prisma.hallForm.delete({
      where: { id },
    });
  }

  // Admin function to disable hall availability for a specific date
  async disableHallAvailability(
    hallId: number,
    date: string,
    reason: string,
    adminId: number,
  ) {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Check if the hall is already booked
    const existingBooking = await this.prisma.hallAvailability.findFirst({
      where: {
        hall_id: hallId,
        date: startOfDay,
        is_booked: true,
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        `The hall is already booked for the selected date.`,
      );
    }

    // Mark the hall as unavailable
    return this.prisma.hallAvailability.create({
      data: {
        hall_id: hallId,
        date: startOfDay,
        is_booked: false,
        reason,
        createdBy: adminId,
      },
    });
  }
}
