import { Controller, Get, Param, Query } from '@nestjs/common';
import { Action } from '@velero-ui/shared-types';
import { Resources, V2alpha1DataUpload } from '@velero-ui/velero';
import { K8sCustomObjectService } from '../k8s-custom-object/k8s-custom-object.service';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { Subject } from '../../shared/decorators/subject.decorator';
import { AppAbility } from '../../shared/modules/casl/casl-ability.factory';
import { SearchDto } from '../../shared/dto/search.dto';

@Controller(Resources.DATA_UPLOAD.route)
@Subject(Resources.DATA_UPLOAD.plural)
export class DataUploadController {
  constructor(private readonly objects: K8sCustomObjectService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resources.DATA_UPLOAD.plural)
  )
  get(@Query() queries: SearchDto) {
    return this.objects.get<V2alpha1DataUpload>(
      Resources.DATA_UPLOAD.plural,
      queries
    );
  }

  @Get('/:name')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, Resources.DATA_UPLOAD.plural)
  )
  getByName(@Param('name') name: string) {
    return this.objects.getByName<V2alpha1DataUpload>(
      Resources.DATA_UPLOAD.plural,
      name
    );
  }
}
