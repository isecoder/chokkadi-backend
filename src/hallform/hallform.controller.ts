// src/hall-form/hall-form.controller.ts
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
  constructor(private readonly hallFormService: HallFormService) {}

  // Save the hall form details
  @Post()
  async createHallForm(@Body() createHallFormDto: CreateHallFormDto) {
    // Validate that mobile number and confirmation match
    if (
      createHallFormDto.mobileNumber !==
      createHallFormDto.mobileNumberConfirmation
    ) {
      throw new BadRequestException(
        'Mobile number and confirmation do not match',
      );
    }

    const result = await this.hallFormService.createHallForm(createHallFormDto);
    return result;
  }

  // Get all Hall forms (Admin access only)
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Get()
  async getAllHallForms() {
    return this.hallFormService.getAllHallForms(); // Call the service to get all Hall forms
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
    return this.hallFormService.getHallFormsByParams(query); // Call the service to get filtered Hall forms
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
}
