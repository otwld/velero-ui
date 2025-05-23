import {
  Body,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PluralsNames, Resource } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { K8sCustomObjectParams } from '@velero-ui-api/shared/dto/k8s-custom-object.dto';
import { KubernetesObject } from '@kubernetes/client-node';
import {
  Action,
  KubernetesListObjectWithFilters,
} from '@velero-ui/shared-types';
import { CheckPolicies } from '@velero-ui-api/shared/decorators/check-policies.decorator';
import { AppAbility } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { SearchDto } from '@velero-ui-api/shared/dto/search.dto';

export class K8sCustomObjectController<
  CustomObjectType extends KubernetesObject = KubernetesObject,
> {
  constructor(
    readonly k8sCustomObjectService: K8sCustomObjectService,
    readonly resource: Resource
  ) {}

  @Get()
  @CheckPolicies((ability: AppAbility, resource: PluralsNames) =>
    ability.can(Action.Read, resource)
  )
  protected get(
    @Param() params: K8sCustomObjectParams,
    @Query() queries: SearchDto
  ): Observable<KubernetesListObjectWithFilters<CustomObjectType>> {
    return this.k8sCustomObjectService.get<CustomObjectType>(
      this.resource.plural,
      queries
    );
  }

  @Get('/:name')
  @CheckPolicies((ability: AppAbility, resource: PluralsNames) =>
    ability.can(Action.Read, resource)
  )
  protected getByName(
    @Param() params: K8sCustomObjectParams
  ): Observable<CustomObjectType> {
    return this.k8sCustomObjectService.getByName<CustomObjectType>(
      this.resource.plural,
      params.name
    );
  }

  @Delete()
  @CheckPolicies((ability: AppAbility, resource: PluralsNames) =>
    ability.can(Action.Delete, resource)
  )
  protected delete(
    @Body() names: string[],
    @Query('forced', new DefaultValuePipe(false), ParseBoolPipe)
    forced?: boolean
  ): Observable<any> {
    return this.k8sCustomObjectService.delete(this.resource.plural, names);
  }

  @Delete('/:name')
  @CheckPolicies((ability: AppAbility, resource: PluralsNames) =>
    ability.can(Action.Delete, resource)
  )
  protected deleteByName(
    @Param() params: K8sCustomObjectParams,
    @Query('forced', new DefaultValuePipe(false), ParseBoolPipe)
    forced?: boolean
  ): Observable<any> {
    return this.k8sCustomObjectService.deleteByName(
      this.resource.plural,
      params.name
    );
  }
}
