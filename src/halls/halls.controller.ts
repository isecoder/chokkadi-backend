import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  UseGuards,
  SetMetadata,
  Session,
  BadRequestException,
} from '@nestjs/common';
import { HallsService } from './halls.service';
import { HallFormService } from 'src/hallform/hallform.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { SessionAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

// Apply SessionAuthGuard globally for the controller
@Controller('halls')
export class HallsController {
  constructor(
    private readonly hallsService: HallsService,
    private readonly hallFormService: HallFormService,
  ) {}

  // Create a new Hall - Only admin users can create Halls
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Post()
  async createHall(
    @Body() createHallDto: CreateHallDto,
    @Session() session: { user?: any },
  ) {
    if (!session.user) {
      throw new BadRequestException('User not authenticated');
    }

    return this.hallsService.createHall(createHallDto);
  }

  // Get all Halls - Any authenticated user can access this route
  @Get()
  async getAllHalls() {
    return this.hallsService.getAllHalls();
  }

  // Get a Hall by ID - Any authenticated user can access this route
  @Get(':id')
  async getHallById(@Param('id') id: number) {
    return this.hallsService.getHallById(id);
  }

  // Update a Hall by ID - Only admin users can access this route
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Patch(':id')
  async updateHall(
    @Param('id') id: number,
    @Body() updateHallDto: UpdateHallDto,
    @Session() session: { user?: any },
  ) {
    if (!session.user) {
      throw new BadRequestException('User not authenticated');
    }

    return this.hallsService.updateHall(id, updateHallDto);
  }

  // Delete a Hall by ID - Only admin users can access this route
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Delete(':id')
  async deleteHall(@Param('id') id: number) {
    return this.hallsService.deleteHall(id);
  }

  // Delete all Halls - Only admin users can access this route
  @UseGuards(SessionAuthGuard)
  @UseGuards(RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role for this route
  @Delete()
  async deleteAllHalls() {
    return this.hallsService.deleteAllHalls();
  }

  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin')
  @Post('disable')
  async disableHallAvailability(
    @Body()
    disableDto: {
      hallId: number;
      date: string;
      reason: string;
      adminId: number;
    },
  ) {
    const { hallId, date, reason, adminId } = disableDto;
    return this.hallFormService.disableHallAvailability(
      hallId,
      date,
      reason,
      adminId,
    );
  }

  // Enable hall availability for a specific date
  @UseGuards(SessionAuthGuard, RolesGuard)
  @SetMetadata('role', 'Admin') // Require Admin role
  @Post('enable')
  async enableHallAvailability(
    @Body() enableDto: { hallId: number; date: string; adminId: number },
  ) {
    const { hallId, date, adminId } = enableDto;

    return this.hallFormService.enableHallAvailability(hallId, date, adminId);
  }
}
