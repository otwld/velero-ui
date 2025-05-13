
export const REGEX = {
  k8sResourceName: /^[A-Za-z0-9]([A-Za-z0-9_.-]{0,61}[A-Za-z0-9])?$/,
  k8sSimpleResource: /^[a-z]+$/,
  k8sGroupedResource: /^([a-z0-9.-]+\.[a-z]{2,})\/[a-z]+$/,
  k8sLabel: /^(?:[a-z0-9](?:[-a-z0-9]*[a-z0-9])?\.)*[a-z]{2,}\/[A-Za-z0-9]([A-Za-z0-9_.-]{0,61}[A-Za-z0-9])?$/,
  s3Bucket: /^(?!^\d+\.\d+\.\d+\.\d+$)(?!-)[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/,
  field: /^[a-zA-Z0-9_-]+$/,
}
