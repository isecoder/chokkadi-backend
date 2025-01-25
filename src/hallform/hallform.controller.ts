import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
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

    // Generate a hall form entry and get the bookingId
    const { bookingId, date } =
      await this.hallFormService.createHallForm(formDetails);

    // Call sendReserveUnderReview before deleting the OTP
    await this.otpService.sendReserveUnderReview({
      fullName: formDetails.name,
      purpose: formDetails.reason,
      mobileNumber: formDetails.mobileNumber,
      bookingDate: formDetails.date,
      contactNumber: process.env.TEMPLE_CONTACT_NUMBER, // Use environment variable or static contact number
      bookingId, // Pass formatted bookingId
    });

    // Call sendReserveRequest to notify admin
    await this.otpService.sendReserveRequest({
      fullName: formDetails.name,
      purpose: formDetails.reason,
      mobileNumber: formDetails.mobileNumber,
      bookingDate: formDetails.date,
      bookingId, // Pass formatted bookingId
    });

    this.otpStoreService.deleteOtp(mobileNumber);

    return {
      message: 'Hall form submitted successfully',
      bookingId,
      date, // Include the date if required
    };
  }

  @Patch(':id/confirm-reserve')
  async confirmReserve(
    @Param('id') hallFormId: number,
    @Body() body: ConfirmReserveDto,
  ) {
    const { date } = body;

    if (!date) {
      throw new BadRequestException('Date is required.');
    }

    // Confirm the reservation in the database
    const hallForm = await this.hallFormService.confirmReserve(
      hallFormId,
      date,
    );

    // Send confirmation message to the user
    await this.otpService.sendReserveConfirmation({
      fullName: hallForm.name,
      purpose: hallForm.reason,
      mobileNumber: hallForm.mobileNumber,
      bookingDate: new Date(date),
      bookingId: hallForm.bookingId,
    });

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
