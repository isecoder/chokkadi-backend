import { Module } from '@nestjs/common';
import { HallsController } from './halls.controller';
import { HallsService } from './halls.service';

@Module({
  controllers: [HallsController],
  providers: [HallsService],
})
export class HallsModule {}
