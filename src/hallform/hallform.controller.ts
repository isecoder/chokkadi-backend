import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { HallFormService } from './hallform.service';
import { CreateHallFormDto } from './dto/create-hallform.dto';
import { ConfirmReserveDto } from './dto/confirm-reserve.dto';
import { OtpStoreService } from '../otp/otp-store.service';
import { OtpService } from '../otp/otp.service'; // Import OtpService
import { SessionAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('hallforms')
export class HallFormController {
  constructor(
    private readonly hallFormService: HallFormService,
    private readonly otpStoreService: OtpStoreService,
    private readonly otpService: OtpService, // Inject OtpService
  ) {}

  @Post()
  async submitHallForm(
    @Body() body: { mobileNumber: string; formDetails: CreateHallFormDto },
  ) {
    const { mobileNumber, formDetails } = body;

    const otpEntry = this.otpStoreService.getOtp(mobileNumber);
    this.otpStoreService.logStore();
    if (!otpEntry || !otpEntry.isVerified) {
      throw new BadRequestException('Mobile number is not verified');
    }

    // Call sendReserveUnderReview before deleting the OTP
    await this.otpService.sendReserveUnderReview({
      fullName: formDetails.name,
      purpose: formDetails.reason,
      mobileNumber: formDetails.mobileNumber,
      bookingDate: formDetails.date,
      contactNumber: process.env.TEMPLE_CONTACT_NUMBER, // Use environment variable or static contact number
    });

    // Call sendReserveRequest to notify admin
    await this.otpService.sendReserveRequest({
      fullName: formDetails.name,
      purpose: formDetails.reason,
      mobileNumber: formDetails.mobileNumber,
      bookingDate: formDetails.date,
    });

    this.otpStoreService.deleteOtp(mobileNumber);

    const result = await this.hallFormService.createHallForm(formDetails);
    return { message: 'Hall form submitted successfully', ...result };
  }

  @Post(':id/confirm-reserve')
  async confirmReserve(
    @Param('id') hallFormId: number,
    @Body() body: ConfirmReserveDto,
  ) {
    const { date } = body;

    if (!date) {
      throw new BadRequestException('Date is required.');
    }

    await this.hallFormService.confirmReserve(hallFormId, date);

    return { message: 'Reservation confirmed successfully.' };
  }
  // Get all Hall forms (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Get()
  async getAllHallForms() {
    return this.hallFormService.getAllHallForms();
  }

  // Get Hall forms by parameters (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Get('filter')
  async getHallFormsByParams(
    @Query()
    query: {
      id?: number;
      name?: string;
      phoneNumber?: string;
      date?: string;
    },
  ) {
    return this.hallFormService.getHallFormsByParams(query);
  }

  // Delete all Hall forms (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Delete()
  async deleteAllHallForms() {
    return this.hallFormService.deleteAllHallForms();
  }

  // Delete a specific Hall form by ID (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Delete(':id')
  async deleteHallFormById(@Param('id') id: number) {
    return this.hallFormService.deleteHallFormById(id);
  }

  // Disable hall availability (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Post('disable')
  async disableHallAvailability(
    @Body()
    body: {
      hallId: number;
      date: string;
      reason: string;
      adminId: number;
    },
  ) {
    return this.hallFormService.disableHallAvailability(
      body.hallId,
      body.date,
      body.reason,
      body.adminId,
    );
  }

  // Enable hall availability (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Post('enable')
  async enableHallAvailability(
    @Body() body: { hallId: number; date: string; adminId: number },
  ) {
    return this.hallFormService.enableHallAvailability(
      body.hallId,
      body.date,
      body.adminId,
    );
  }
}
