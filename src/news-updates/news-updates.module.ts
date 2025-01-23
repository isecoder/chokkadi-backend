import { Module } from '@nestjs/common';
import { NewsUpdatesService } from './news-updates.service';
import { NewsUpdatesController } from './newsupdates.controller';

@Module({
  providers: [NewsUpdatesService],
  controllers: [NewsUpdatesController],
})
export class NewsupdatesModule {}
