import { Global, Module } from '@nestjs/common';
import { VeleroService } from './velero.service';

@Global()
@Module({
  imports: [],
  providers: [VeleroService],
  exports: [VeleroService]
})
export class VeleroModule {
}
