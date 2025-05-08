import { Module, OnModuleInit } from '@nestjs/common';
import { CaslAbilityFactory } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule implements OnModuleInit {

  constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}

  public onModuleInit() {
    return this.caslAbilityFactory.onModuleInit();
  }
}
