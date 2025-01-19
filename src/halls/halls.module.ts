import { Module } from '@nestjs/common';
import { HallsController } from './halls.controller';
import { HallsService } from './halls.service';
import { HallFormService } from 'src/hallform/hallform.service';

@Module({
  controllers: [HallsController],
  providers: [HallsService, HallFormService],
})
export class HallsModule {}
