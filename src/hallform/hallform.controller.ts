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
  ParseIntPipe,
} from '@nestjs/common';
import { HallFormService } from './hallform.service';
import { CreateHallFormDto } from './dto/create-hallform.dto';
import { ConfirmReserveDto } from './dto/confirm-reserve.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
// import { OtpStoreService } from '../otp/otp-store.service';
// import { OtpService } from '../otp/otp.service';
import { SessionAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('hallforms')
export class HallFormController {
  constructor(
    private readonly hallFormService: HallFormService,
    // private readonly otpStoreService: OtpStoreService,
    // private readonly otpService: OtpService,
  ) {}

  @Post()
  async submitHallForm(
    @Body() body: { mobileNumber: string; formDetails: CreateHallFormDto },
  ) {
    const { mobileNumber, formDetails } = body;

    // 🔒 OTP validation disabled
    /*
    const otpEntry = this.otpStoreService.getOtp(mobileNumber);
    this.otpStoreService.logStore();
    if (!otpEntry || !otpEntry.isVerified) {
      throw new BadRequestException('Mobile number is not verified');
    }
    */

    const { bookingId, date } =
      await this.hallFormService.createHallForm(formDetails);

    // 🔔 Notifications disabled
    /*
    await this.otpService.sendReserveUnderReview({
      fullName: formDetails.name,
      purpose: formDetails.reason,
      mobileNumber: formDetails.mobileNumber,
      bookingDate: formDetails.date,
      bookingId,
    });

    await this.otpService.sendReserveRequest({
      fullName: formDetails.name,
      purpose: formDetails.reason,
      mobileNumber: formDetails.mobileNumber,
      bookingDate: formDetails.date,
      bookingId,
    });

    this.otpStoreService.deleteOtp(mobileNumber);
    */

    return {
      message: 'Hall form submitted successfully',
      bookingId,
      date,
      formDetails,
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

    const { bookingId, hallForm } = await this.hallFormService.confirmReserve(
      hallFormId,
      date,
    );

    // 🔔 Confirmation notification disabled
    /*
    await this.otpService.sendReserveConfirmation({
      fullName: hallForm.name,
      purpose: hallForm.reason,
      mobileNumber: hallForm.mobileNumber,
      bookingDate: new Date(date),
      bookingId,
    });
    */

    return {
      message: 'Reservation confirmed successfully.',
      bookingId,
    };
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Get()
  async getAllHallForms() {
    return this.hallFormService.getAllHallForms();
  }

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

  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Delete()
  async deleteAllHallForms() {
    return this.hallFormService.deleteAllHallForms();
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Delete(':id')
  async deleteHallFormById(@Param('id') id: number) {
    return this.hallFormService.deleteHallFormById(id);
  }

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

  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Post('manual')
  async submitHallFormWithoutOtp(
    @Body() body: { formDetails: CreateHallFormDto },
  ) {
    const { formDetails } = body;

    const { bookingId, date } =
      await this.hallFormService.createManualHallForm(formDetails);

    return {
      message: 'Hall form submitted successfully',
      bookingId,
      date,
      formDetails,
    };
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Patch(':id/payment')
  async updatePaymentDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.hallFormService.updatePaymentDetails(id, updatePaymentDto);
  }
}
