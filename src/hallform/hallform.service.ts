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
    parsedDate.setUTCHours(0, 0, 0, 0); // Ensure the time is set to 00:00:00 UTC

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
    const endOfDay = new Date(parsedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

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

    // Proceed to create the hall form entry
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

    // Populate hall availability with is_booked as false
    await this.prisma.hallAvailability.create({
      data: {
        hall_id: hallId,
        date: startOfDay,
        is_booked: false,
        reason: 'On hold',
      },
    });

    // Generate a bookingId by appending 'DES' to the created hall form's ID
    const bookingId = `DES${createdHallForm.id}`;

    return {
      bookingId, // Return the bookingId
      date: parsedDate.toISOString().split('T')[0],
    };
  }

  // Retrieve all Hall forms
  async getAllHallForms() {
    const hallForms = await this.prisma.hallForm.findMany({
      include: {
        hall: {
          select: {
            name: true,
            description: true,
            name_kannada: true,
            description_kannada: true,
            available: true,
            hallAvailability: true,
            HallImages: true,
          },
        },
      },
    });

    return hallForms.map((form) => ({
      ...form,
      date: new Date(form.date).toISOString().split('T')[0], // Ensure the date is returned in YYYY-MM-DD format
      hall: {
        ...form.hall,
        hallAvailability: form.hall.hallAvailability.map((availability) => ({
          ...availability,
          date: new Date(availability.date).toISOString().split('T')[0], // Ensure availability dates are formatted
        })),
      },
    }));
  }

  // Retrieve Hall forms by parameters
  async getHallFormsByParams(filter: any) {
    const hallForms = await this.prisma.hallForm.findMany({
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

    return hallForms.map((form) => ({
      ...form,
      date: new Date(form.date).toISOString().split('T')[0],
    }));
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
    parsedDate.setUTCHours(0, 0, 0, 0);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }

    const startOfDay = new Date(parsedDate);

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

  async confirmReserve(hallFormId: number, date: Date): Promise<any> {
    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0); // Ensure the time is set to 00:00:00 UTC

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }

    return await this.prisma.$transaction(async (prisma) => {
      // Fetch the specific hall form entry by ID
      const hallForm = await prisma.hallForm.findUnique({
        where: { id: hallFormId },
      });

      if (
        !hallForm ||
        new Date(hallForm.date).getTime() !== parsedDate.getTime()
      ) {
        throw new NotFoundException(
          'No hall form found for the specified ID and date.',
        );
      }

      // Check if availability exists and is not already booked for the hallForm's hall ID and date
      const availability = await prisma.hallAvailability.findFirst({
        where: {
          hall_id: hallForm.hallId,
          date: parsedDate,
          is_booked: false,
        },
      });

      if (!availability) {
        throw new BadRequestException(
          'The hall is either already booked or not available for the selected date.',
        );
      }

      // Mark the hall as booked with the reason from the hall form
      await prisma.hallAvailability.update({
        where: { id: availability.id },
        data: {
          is_booked: true,
          reason: `Booked for ${hallForm.reason}`,
        },
      });

      // Generate a bookingId by appending 'DES' to the hall form's ID
      const bookingId = `DES${hallForm.id}`;

      // Return the hall form details along with the generated bookingId
      return {
        bookingId,
        hallForm,
      };
    });
  }

  // Enable hall availability
  async enableHallAvailability(hallId: number, date: string, adminId: number) {
    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }

    const startOfDay = new Date(parsedDate);

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
  async generateBookingId(numericId: number): Promise<string> {
    // Convert numeric ID to a string with the 'DES' prefix
    return `DES${numericId}`;
  }
}
