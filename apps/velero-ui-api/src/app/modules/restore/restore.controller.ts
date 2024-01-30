import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RestoreService } from './restore.service';

@Controller('restores')
export class RestoreController {
  constructor(private readonly restoreService: RestoreService) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ) {
    return this.restoreService.find(offset, limit, search);
  }
}
