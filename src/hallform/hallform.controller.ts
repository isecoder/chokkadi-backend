import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  UseGuards,
  SetMetadata,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { HallFormService } from './hallform.service';
import { CreateHallFormDto } from './dto/create-hallform.dto';
import { SessionAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('hallforms')
export class HallFormController {
  private otpStore: Map<string, { otp: string; isVerified: boolean }>;

  constructor(private readonly hallFormService: HallFormService) {
    this.otpStore = new Map(); // Initialize the OTP store
  }

  // Submit Hall Form
  @Post()
  async submitHallForm(
    @Body() body: { mobileNumber: string; formDetails: CreateHallFormDto },
  ) {
    const { mobileNumber, formDetails } = body;

    if (!mobileNumber) {
      throw new BadRequestException('Mobile number is required');
    }

    const otpEntry = this.otpStore.get(mobileNumber);
    console.log('OTP Store:', this.otpStore);
    if (!otpEntry || !otpEntry.isVerified) {
      throw new BadRequestException('Mobile number is not verified');
    }

    // Clear the verification status after submission
    this.otpStore.delete(mobileNumber);

    // Call the service to process the form details
    const result = await this.hallFormService.createHallForm(formDetails);
    return { message: 'Hall form submitted successfully', ...result };
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
