import { Inject, Injectable } from '@nestjs/common';
import {
  CoreV1Api,
  KubeConfig,
  KubernetesListObject,
  V1Namespace,
  V1Secret,
  V1SecretList,
} from '@kubernetes/client-node';
import { K8S_CONNECTION } from '@velero-ui-api/shared/modules/k8s/k8s.constants';
import { from, map, Observable } from 'rxjs';
import http from 'http';
import { V1NamespaceList } from '@kubernetes/client-node/dist/gen/model/v1NamespaceList';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import {
  Resources,
  V1BackupStorageLocation,
  V1BackupStorageLocationList,
  V1Schedule,
  V1ScheduleList,
  V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationList,
} from '@velero-ui/velero';
import { FormList } from '@velero-ui/shared-types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FormService {
  private k8sCoreApi: CoreV1Api;

  constructor(
    @Inject(K8S_CONNECTION) private readonly k8s: KubeConfig,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
    private configService: ConfigService,
  ) {
    this.k8sCoreApi = this.k8s.makeApiClient(CoreV1Api);
  }

  public getNamespaces(): Observable<FormList<string>> {
    return from(this.k8sCoreApi.listNamespace())
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1NamespaceList }) =>
            r.body,
        ),
      )
      .pipe(
        map(
          (r: V1NamespaceList): FormList<string> => ({
            total: r.items.length,
            items: r.items.map((n: V1Namespace): string => n.metadata.name),
          }),
        ),
      );
  }

  public getSchedules(): Observable<FormList<string>> {
    return from(
      this.k8sCustomObjectService.get<V1Schedule, V1ScheduleList>(
        Resources.SCHEDULE.plurial,
      ),
    ).pipe(
      map(
        (r: KubernetesListObject<V1Schedule>): FormList<string> => ({
          total: r.items.length,
          items: r.items.map((n: V1Schedule): string => n.metadata.name),
        }),
      ),
    );
  }

  public getStorageLocations(): Observable<FormList<string>> {
    return from(
      this.k8sCustomObjectService.get<
        V1BackupStorageLocation,
        V1BackupStorageLocationList
      >(Resources.BACKUP_STORAGE_LOCATION.plurial),
    ).pipe(
      map(
        (
          r: KubernetesListObject<V1BackupStorageLocation>,
        ): FormList<string> => ({
          total: r.items.length,
          items: r.items.map(
            (n: V1BackupStorageLocation): string => n.metadata.name,
          ),
        }),
      ),
    );
  }

  public getSnapshotLocations(): Observable<FormList<string>> {
    return from(
      this.k8sCustomObjectService.get<
        V1VolumeSnapshotLocation,
        V1VolumeSnapshotLocationList
      >(Resources.VOLUME_SNAPSHOT_LOCATION.plurial),
    ).pipe(
      map(
        (
          r: KubernetesListObject<V1VolumeSnapshotLocation>,
        ): FormList<string> => ({
          total: r.items.length,
          items: r.items.map(
            (n: V1VolumeSnapshotLocation): string => n.metadata.name,
          ),
        }),
      ),
    );
  }

  public getSecrets(): Observable<FormList<string>> {
    return from(
      this.k8sCoreApi.listNamespacedSecret(
        this.configService.get('velero.namespace'),
      ),
    )
      .pipe(
        map(
          (r: { response: http.IncomingMessage; body: V1NamespaceList }) =>
            r.body,
        ),
      )
      .pipe(
        map(
          (r: V1SecretList): FormList<string> => ({
            total: r.items.length,
            items: r.items.map((n: V1Secret): string => n.metadata.name),
          }),
        ),
      );
  }
}
