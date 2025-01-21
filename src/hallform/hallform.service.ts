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
    const {
      mobileNumber,
      date,
      hallId,
      name,
      reason,
      mobileNumberConfirmation,
    } = createHallFormDto;

    if (mobileNumber !== mobileNumberConfirmation) {
      throw new BadRequestException(
        'Mobile number confirmation does not match.',
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }

    const hall = await this.prisma.halls.findUnique({
      where: { hall_id: hallId },
    });
    if (!hall) {
      throw new NotFoundException(`Hall with ID ${hallId} not found.`);
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if the hall is already booked
    const existingBooking = await this.prisma.hallAvailability.findFirst({
      where: {
        hall_id: hallId,
        date: { gte: startOfDay, lte: endOfDay },
        is_booked: true,
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'The hall is already unavailable for the selected date.',
      );
    }

    // Check if the hall is disabled
    const disabledHall = await this.prisma.hallAvailability.findFirst({
      where: {
        hall_id: hallId,
        date: { gte: startOfDay, lte: endOfDay },
        is_booked: false,
      },
    });

    if (disabledHall) {
      throw new BadRequestException(
        `The hall is disabled for the selected date due to: ${disabledHall.reason}`,
      );
    }

    // Mark the hall as booked
    await this.prisma.hallAvailability.create({
      data: {
        hall_id: hallId,
        date: startOfDay,
        is_booked: true,
        reason: `Booked by ${name}`,
      },
    });

    // Create the hall form entry
    const createdHallForm = await this.prisma.hallForm.create({
      data: {
        name,
        mobileNumber,
        mobileNumberConfirmation,
        date: parsedDate,
        hall: {
          connect: { hall_id: hallId },
        },
        reason,
      },
    });

    return { id: createdHallForm.id };
  }

  // Retrieve all Hall forms
  async getAllHallForms() {
    return this.prisma.hallForm.findMany({
      include: {
        hall: {
          select: { name: true },
        },
      },
    });
  }

  // Retrieve Hall forms by parameters
  async getHallFormsByParams(filter: any) {
    return this.prisma.hallForm.findMany({
      where: {
        OR: [
          { id: filter.id },
          { name: { contains: filter.name } },
          { mobileNumber: filter.phoneNumber },
          { date: filter.date ? new Date(filter.date) : undefined },
        ],
      },
      include: {
        hall: { select: { name: true } },
      },
    });
  }

  // Delete all Hall forms
  async deleteAllHallForms() {
    return this.prisma.hallForm.deleteMany();
  }

  // Delete a specific Hall form by ID
  async deleteHallFormById(id: number) {
    const booking = await this.prisma.hallForm.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Hall Form with ID ${id} not found.`);
    }

    await this.prisma.hallAvailability.deleteMany({
      where: { hall_id: booking.hallId, date: booking.date },
    });

    return this.prisma.hallForm.delete({ where: { id } });
  }

  // Disable hall availability
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

    const existingBooking = await this.prisma.hallAvailability.findFirst({
      where: { hall_id: hallId, date: startOfDay, is_booked: true },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'The hall is already booked for the selected date.',
      );
    }

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

  // Enable hall availability
  async enableHallAvailability(hallId: number, date: string, adminId: number) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const disabledHall = await this.prisma.hallAvailability.findFirst({
      where: { hall_id: hallId, date: startOfDay, is_booked: false },
    });

    if (!disabledHall) {
      throw new BadRequestException(
        'The hall is not disabled for the selected date.',
      );
    }

    return this.prisma.hallAvailability.update({
      where: { id: disabledHall.id },
      data: {
        is_booked: true,
        reason: `Enabled by Admin ID: ${adminId}`,
      },
    });
  }
}
