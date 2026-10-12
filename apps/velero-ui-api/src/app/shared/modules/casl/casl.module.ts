import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
