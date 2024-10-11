import { Controller, Get } from '@nestjs/common';
import { FormService } from '@velero-ui-api/modules/form/form.service';
import { Observable } from 'rxjs';
import { FormList } from '@velero-ui/shared-types';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get('/schedules')
  public getFormSchedules(): Observable<FormList<string>> {
    return this.formService.getSchedules();
  }

  @Get('/namespaces')
  public getNamespaces(): Observable<FormList<string>> {
    return this.formService.getNamespaces();
  }

  @Get('/storage-locations')
  public getStorageLocations(): Observable<FormList<string>> {
    return this.formService.getStorageLocations();
  }

  @Get('/snapshot-locations')
  public getSnapshotLocations(): Observable<FormList<string>> {
    return this.formService.getSnapshotLocations();
  }

  @Get('/secrets')
  public getFormSecrets(): Observable<FormList<string>> {
    return this.formService.getSecrets();
  }
}
