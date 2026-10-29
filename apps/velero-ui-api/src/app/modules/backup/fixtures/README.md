# Synthetic VolumeInfos compatibility fixtures

Minimal synthetic examples; no cluster data. Each file follows the JSON fields in
`internal/volume/volumes_information.go` in its corresponding upstream tag:
https://github.com/vmware-tanzu/velero/blob/v1.13.0/internal/volume/volumes_information.go
through `v1.18.0` (replace tag in URL).

Go fields `ReadyToUse` and `Phase` lack JSON tags and retain PascalCase. They and
`result` are absent in 1.13–1.14; movement `size` is absent in 1.13. CSI unknown
placeholders are deliberate. These are contract simulations, not cluster tests.
