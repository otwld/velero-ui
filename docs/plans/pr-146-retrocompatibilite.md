# PR 146 — Rétrocompatibilité des volumes et snapshots

Plan de corrections approuvé et exécuté localement le 25 octobre 2026. Voir le [rapport d'exécution](./pr-146-execution.md) pour les validations et leurs limites. Aucun commit ni push effectué.

PR : https://github.com/otwld/velero-ui/pull/146
Branche locale : `codex/pr-146-compat` ; branche suivie : `lappihuan/feat/snapshot-datamover-progress`.

### Objectif et limites

Conserver le support annoncé de Velero 1.13 à 1.18, sans supposer que la version du serveur correspond à celle qui a créé chaque sauvegarde. Ne pas étendre la garantie aux versions antérieures ou futures sans preuves et validations supplémentaires.

Les corrections doivent traiter les capacités et métadonnées réellement disponibles. Une erreur de stockage, de permissions ou de décodage ne doit jamais être transformée en une liste vide présentée comme complète.

Hors périmètre global : mise à niveau de Velero, modification de ses CRD, refonte des menus, publication, push et fusion de la PR. Les commandes proposées ne sont pas exécutées par ce plan et chaque commande ECC conserve son propre fonctionnement.

### Constats vérifiés et sources

- Velero 1.13–1.16 écrit encore les fichiers CSI séparés demandés par la PR ; 1.17 et 1.18 ne les écrivent plus. Le changement amont est https://github.com/velero-io/velero/pull/8946.
- `BackupVolumeInfos` existe depuis 1.13. Les métadonnées 1.13 ne sont pas toutes actualisées après les opérations asynchrones ; certains champs ultérieurs sont absents. Source : https://github.com/velero-io/velero/blob/v1.13.0/changelogs/CHANGELOG-1.13.md.
- Les modèles et la persistance ont été comparés dans les tags 1.13.0, 1.14.0, 1.15.0, 1.16.0, 1.17.0 et 1.18.0 du dépôt amont. Cela constitue une vérification de code, pas une certification en cluster de toutes les versions correctives.
- Les API DataUpload/DataDownload restent en `velero.io/v2alpha1` dans ces tags. Les lectures CSI utilisent `snapshot.storage.k8s.io/v1`.
- Le `forkJoin` actuel fait perdre les résultats natifs lorsqu'une source CSI échoue.
- La review a validé 29 tests UI et 29 tests API ciblés. Les mocks actuels rendent les archives CSI disponibles et ne reproduisent donc pas la rupture 1.17.

## Step 1 — Corriger la normalisation des métadonnées historiques

**Identifiant :** step-1. **Tags :** fix, test. **Dépendances :** aucune.

Créer les types et adaptateurs nécessaires pour lire `BackupVolumeInfos` et les formats historiques sans changer la signification des données. Utiliser des fixtures minimales sourcées et annotées par version, sans secrets ni données d'un cluster réel.

Fichiers concernés : `libs/velero/src/models/backup/backupSnapshots.ts`, exports et enum DownloadTargetKind si nécessaire, `apps/velero-ui-api/src/app/modules/backup/backup-snapshots.utils.ts`, tests associés.

Acceptance:

1. Des fixtures 1.13, 1.14–1.16 et 1.17–1.18 produisent une représentation commune des snapshots CSI/natifs ; namespace, PVC/PV, identifiant fournisseur, driver et taille sont conservés lorsqu'ils existent.
2. Champs absents, métadonnées asynchrones incomplètes en 1.13 et valeurs inconnues ne causent aucun crash et ne deviennent pas artificiellement un succès ou une taille nulle certaine.
3. Les adaptateurs historiques restent couverts et une identité stable permet la déduplication ultérieure ; aucune progression de transfert n'est inventée à partir de métadonnées de snapshot.

## Step 2 — Corriger la sélection des sources et les replis

**Identifiant :** step-2. **Tags :** fix, test. **Dépendances :** step-1.

Corriger `BackupSnapshotsService` pour récupérer les sauvegardes terminées via `BackupVolumeInfos`, tout en conservant un repli/enrichissement depuis les métadonnées historiques lorsque celles-ci sont disponibles et nécessaires. Le choix ne repose pas exclusivement sur le numéro du serveur ou sur les compteurs du Backup. Conserver les lectures CSI Kubernetes pour les sauvegardes en cours.

Fichiers concernés : `backup-snapshots.service.ts`, ses tests, et le service DownloadRequest uniquement si une distinction fiable des erreurs le nécessite.

Acceptance:

1. Une sauvegarde créée en 1.17/1.18 est lisible sans les deux fichiers CSI séparés ; une ancienne sauvegarde demeure lisible après import sur un serveur plus récent, y compris si VolumeInfos est absent ou incomplet.
2. Seule une absence de ressource/artefact ou une capacité explicitement indisponible déclenche un repli ; refus d'accès, timeouts, stockage indisponible et gzip/JSON invalide restent identifiables. Ne pas assimiler automatiquement tout HTTP 403 à un fichier absent.
3. Les sources ne sont ni téléchargées inutilement ni fusionnées en doublon ; une sauvegarde sans snapshots ne provoque pas de téléchargements d'archives injustifiés. Chaque branche de repli possède un test de régression.

## Step 3 — Corriger les résultats partiels et leur affichage

**Identifiant :** step-3. **Tags :** fix, test, security. **Dépendances :** step-2.

Isoler les résultats et erreurs de chaque source au lieu de faire échouer tout le panneau. Définir un contrat explicite de résultat partiel, adapter le contrôleur et tous ses consommateurs, puis rendre les informations disponibles avec un avertissement de source compréhensible. Préserver les règles d'accès et l'absence tolérée de CRD facultatives.

Fichiers concernés : modèle partagé, `backup.controller.ts`, `backup-snapshots.service.ts`, `PodVolumes.vue`, lignes snapshot/data mover si nécessaire, composables concernés, traductions en/fr/ru/zh et tests.

Acceptance:

1. Une panne CSI laisse les snapshots natifs visibles ; une panne native laisse les CSI visibles. Une absence normale de capacité facultative est distinguée d'un échec ; un panneau partiel n'annonce pas une liste exhaustive.
2. Le passage en cours → terminé conserve les volumes et erreurs utiles sans double comptage entre VolumeInfos, anciens snapshots et DataUploads ; les informations absentes restent présentées comme inconnues et le total d'octets n'est pas artificiellement doublé.
3. Les permissions `read,backups`, `read,datauploads`, `read,datadownloads` et filesystem restent respectées ; aucun accès non autorisé, 403 ou incident de stockage n'est silencieusement présenté comme une compatibilité réussie.

## Step 4 — Ajouter les tests de compatibilité et valider avec Nx

**Identifiant :** step-4. **Tags :** test. **Dépendances :** step-1 à step-3.

Compléter les tests de régression adjacents aux corrections avec une matrice de contrats HTTP/Kubernetes et de fichiers stockés représentative. Les fixtures doivent être traçables aux tags amont ; les simulations de versions non testées en cluster ne doivent pas être présentées comme des validations réelles.

Acceptance:

1. Couvrir 1.13 et ses champs absents, 1.14–1.16, 1.17–1.18 sans archives CSI, ancienne sauvegarde sur nouveau serveur, snapshots natifs/CSI/mixte/filesystem et `snapshotMoveData=true`.
2. Couvrir absence de CRD, permissions insuffisantes, artefact absent, stockage indisponible, réponse corrompue, résultat partiel, transition de phase et déduplication. Les tests auraient échoué avant les corrections correspondantes.
3. Exécuter les tâches Nx pertinentes au plus petit périmètre suffisant et consigner résultats et limites ; aucune désactivation des caches locaux/distants, du daemon ou des caches de tâches, aucun `nx reset`.

Validation manuelle ciblée possible, à adapter aux fichiers finalement modifiés :

```bash
npx nx run velero-ui-api:test --runInBand --testPathPatterns='backup-snapshots|security|k8s-custom-object.service'
npx nx run velero-ui:test --run --testNamePattern='volume|snapshot|menu|data mover' --reportsDirectory=coverage/apps/velero-ui
npx nx affected -t lint --base=a7e23f275aeafdb0b64db3fdce1f74fa853d677f
```

Le paramètre `reportsDirectory` garde la sortie UI dans le workspace : la valeur configurée `../../coverage/apps/velero-ui` a provoqué un refus Nx lors de la review. Il ne désactive aucun cache. Ajuster le périmètre des tests si leur nommage évolue ; ajouter les builds des projets affectés lorsque les changements de contrat/types le justifient, sans répéter les tâches déjà validées à entrées inchangées.

Si des environnements existants sont accessibles, compléter par des essais en cluster sur les deux côtés de la rupture 1.17. Sinon, documenter explicitement que ces essais n'ont pas été réalisés ; ne pas déployer de cluster ni modifier de CRD dans le cadre de ce plan.

## Step 5 — Documenter la compatibilité et les limites

**Identifiant :** step-5. **Tags :** docs. **Dépendances :** step-4.

Actualiser `docs/docs/features.md`, `docs/docs/sso-ldap/rbac.md` et la section de compatibilité du README uniquement si nécessaire, pour refléter le comportement effectivement livré.

Acceptance:

1. La matrice distingue la version créatrice de la sauvegarde de celle du serveur courant, décrit les sources utilisées et précise le support 1.13–1.18 sans garantie inventée pour les versions futures.
2. Les limitations 1.13, les champs inconnus, les résultats partiels, les CRD facultatives et la mise à jour du ClusterRole sont expliqués ; les validations simulées et en cluster sont distinguées.

## Step 6 — Faire la review finale de la PR 146

**Identifiant :** step-6. **Tags :** review. **Dépendances :** step-4 et step-5.

Relire le diff final des corrections, les contrats API/UI, les accès et la matrice de rétrocompatibilité. La commande de review de PR distante ne porte sur les corrections que lorsqu'elles ont été intégrées à cette PR par une action distincte autorisée. Avant cela, examiner le diff local de la branche contre le commit de départ `a7e23f275aeafdb0b64db3fdce1f74fa853d677f`.

Acceptance:

1. Aucun défaut bloquant de rétrocompatibilité ne reste ouvert ; les corrections ne modifient pas le fonctionnement des sauvegardes/restaurations Velero elles-mêmes.
2. Le compte rendu relie chaque exigence à une validation et distingue précisément ce qui est testé, simulé ou non vérifié.

Cette étape ne vaut pas autorisation de publier une review GitHub, de pousser ou de fusionner. Une review locale est suffisante tant que la PR distante ne contient pas les corrections.
