import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {RestoreService} from './restore.service';
import {Observable} from "rxjs";
import {V1RestoreList} from "@velero-ui/velero";

@Controller('restores')
export class RestoreController {
  constructor(private readonly restoreService: RestoreService) {
  }

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1RestoreList> {
    return this.restoreService.find(offset, limit, search);
  }
}
