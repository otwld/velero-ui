# Plan-Orchestrate Result

Ce document conserve le routage proposé avant exécution. Les six étapes ont ensuite été exécutées localement à la demande de l'utilisateur ; voir le [rapport d'exécution](./pr-146-execution.md). Les statuts BLOCKED ci-dessous ne concernaient que la capacité des commandes à transporter le périmètre, pas l'exécution manuelle de ces étapes.

**Plan**: [docs/plans/pr-146-retrocompatibilite.md](/Users/jdetroyes/WebstormProjects/velero-ui/docs/plans/pr-146-retrocompatibilite.md)
**Steps**: 6
**Scope**: all
**Emitted**: 3 · **Blocked**: 3

Les commandes ci-dessous sont des propositions à copier dans ECC, pas des commandes shell. Aucune correction, validation supplémentaire, commande ECC, publication ou opération Git distante n'a été exécutée. Chaque commande possède son propre processus ; ce document ne contrôle pas son exécution interne.

Le plan source décrit les fichiers concernés, les dépendances et la matrice de compatibilité. Conserver les caches Nx locaux/distants et le daemon ; une validation déjà réussie n'est pas à répéter si ses entrées et son périmètre sont inchangés.

## Steps overview

| # | Titre | Tags | Commande | Statut |
|---|---|---|---|---|
| 1 | Corriger la normalisation des métadonnées historiques | fix, test | `/orch-fix-defect` | emitted |
| 2 | Corriger la sélection des sources et les replis | fix, test | `/orch-fix-defect` | emitted |
| 3 | Corriger les résultats partiels et leur affichage | fix, test, security | `/orch-fix-defect` | emitted |
| 4 | Ajouter les tests de compatibilité et valider avec Nx | test | `/test-coverage` | BLOCKED — cannot carry plan scope |
| 5 | Documenter la compatibilité et les limites | docs | `/update-docs` | BLOCKED — cannot carry plan scope |
| 6 | Faire la review finale de la PR 146 | review | `/code-review` | BLOCKED — cannot carry plan scope |

Les étapes sont séquentielles : 1 → 2 → 3 → 4 → 5 → 6. Les tests de régression propres à chaque défaut font partie des étapes 1 à 3 ; l'étape 4 complète et valide la matrice transversale.

## Step 1 — Corriger la normalisation des métadonnées historiques

**Intent**: Normaliser les formats VolumeInfos et historiques des sauvegardes Velero 1.13 à 1.18, avec des fixtures traçables. Préserver les informations disponibles et les valeurs inconnues.
**Tags**: fix, test
**Command rationale**: Le défaut de lecture des formats justifie `/orch-fix-defect` ; les critères de tests historiques voyagent dans sa description de tâche.

```text
/orch-fix-defect "[Plan: docs/plans/pr-146-retrocompatibilite.md#step-1] Corriger les adaptateurs de snapshots de la PR 146 pour lire BackupVolumeInfos et les archives historiques Velero 1.13–1.18. Acceptance: fixtures sourcées normalisées avec PVC/PV, namespace et identifiants conservés; champs absents et état inconnu sans faux succès ni crash; formats historiques et identité de déduplication couverts par tests."
```

## Step 2 — Corriger la sélection des sources et les replis

**Intent**: Après l'étape 1, réparer la lecture des sauvegardes récentes sans archives CSI séparées et celle des sauvegardes historiques importées. Distinguer un artefact absent d'un incident de permissions, de stockage ou de décodage.
**Tags**: fix, test
**Command rationale**: `/orch-fix-defect` porte le défaut de sélection de source et ses scénarios de régression, sans imposer de seuil de version comme unique décision.

```text
/orch-fix-defect "[Plan: docs/plans/pr-146-retrocompatibilite.md#step-2] Corriger BackupSnapshotsService de la PR 146: lire BackupVolumeInfos et utiliser les archives historiques disponibles en repli ou enrichissement, sans sélection fondée uniquement sur la version serveur. Acceptance: nouvelles sauvegardes 1.17/1.18 et anciennes importées lisibles; absence distinguée des 403, timeouts et données corrompues; régressions couvertes sans doublons ni téléchargements inutiles."
```

## Step 3 — Corriger les résultats partiels et leur affichage

**Intent**: Après l'étape 2, isoler les erreurs natives/CSI dans un contrat API explicite et adapter le panneau UI. Préserver les accès, les sources disponibles et les compteurs sans doublons.
**Tags**: fix, test, security
**Command rationale**: `fix` est prioritaire ; `/orch-fix-defect` conserve les critères de permissions, de résultats partiels et les tests API/UI dans son argument.

```text
/orch-fix-defect "[Plan: docs/plans/pr-146-retrocompatibilite.md#step-3] Corriger API et panneau PodVolumes de la PR 146 pour conserver les résultats partiels et signaler les erreurs par source. Acceptance: panne CSI ou native sans disparition de l'autre source; transition en cours vers terminé sans doublons de volumes ou d'octets; permissions et CRD facultatives respectées sans masquer les refus d'accès, avec tests API/UI et traductions."
```

## Step 4 — Ajouter les tests de compatibilité et valider avec Nx (blocked)

**Intent**: Après les étapes 1 à 3, compléter la matrice 1.13–1.18, les sauvegardes historiques sur serveur récent, les erreurs et les transitions. Exécuter les validations Nx ciblées du plan, caches conservés, et documenter les limites des simulations.
**Tags**: test
**Command rationale**: `/test-coverage` n'accepte pas de description de tâche. Une commande nue ne transmettrait ni la matrice de compatibilité ni les contraintes Nx ; elle peut aussi élargir le périmètre selon son propre fonctionnement.

```text
BLOCKED — /test-coverage cannot carry plan scope; run manually if wanted: /test-coverage
```

Effectuer cette étape manuellement selon le périmètre détaillé dans le plan source, y compris les commandes Nx proposées. L'absence de routage ne dispense pas de cette validation.

## Step 5 — Documenter la compatibilité et les limites (blocked)

**Intent**: Après l'étape 4, actualiser les fonctionnalités et le RBAC pour décrire le comportement livré : versions supportées, origine des sauvegardes, champs inconnus, résultats partiels et permissions.
**Tags**: docs
**Command rationale**: `/update-docs` ne possède pas d'argument documenté portant les fichiers et critères de cette étape ; ne pas lui inventer de description de tâche.

```text
BLOCKED — /update-docs cannot carry plan scope; run manually if wanted: /update-docs
```

Effectuer manuellement la mise à jour des fichiers ciblés par le plan source. La commande générale reste facultative et n'est pas un substitut scoped à cette étape.

## Step 6 — Faire la review finale de la PR 146 (blocked)

**Intent**: Après les étapes 4 et 5, relire les corrections locales contre le commit initial et vérifier les contrats, les accès et les preuves de compatibilité. Une review distante n'inclut les corrections qu'après leur intégration autorisée à la PR.
**Tags**: review
**Command rationale**: `/code-review` accepte uniquement une référence de PR ou aucun argument ; l'identité et le périmètre du plan ne peuvent pas être transmis. Attention : le mode PR de cette commande prévoit une publication de review selon son propre processus ; ne pas la lancer pour une lecture locale seule.

```text
BLOCKED — /code-review cannot carry plan scope; run manually if wanted: /code-review https://github.com/otwld/velero-ui/pull/146
```

Privilégier d'abord la lecture du diff local contre `a7e23f275aeafdb0b64db3fdce1f74fa853d677f`. La forme locale `/code-review` ne couvre que les changements non commitées selon sa documentation ; elle ne remplace pas une review de branche lorsque les corrections ont déjà été commitées.

## Étapes exclues du batch

- Step 4 : `/test-coverage`, facultatif et manuel ; validation ciblée obligatoire selon le plan.
- Step 5 : `/update-docs`, facultatif et manuel ; documentation ciblée obligatoire selon le plan.
- Step 6 : `/code-review https://github.com/otwld/velero-ui/pull/146`, manuel, avec les limites locales/distantes ci-dessus.

Ce statut concerne uniquement le routage. Le [skill plan-orchestrate](/Users/jdetroyes/.codex/plugins/cache/ecc/ecc/2.2.3/skills/plan-orchestrate/SKILL.md) impose : « Everything else fails closed. » Ces trois commandes ne peuvent pas transporter le périmètre du plan dans leur forme documentée.

## Batch execution

Bloc regroupant uniquement les étapes 1 à 3, dans l'ordre ; il ne couvre pas les étapes manuelles 4 à 6 et ne garantit pas leur exécution automatique. Chaque commande orchestre ses propres travaux et peut demander une intervention conformément à son fonctionnement.

```text
/orch-fix-defect "[Plan: docs/plans/pr-146-retrocompatibilite.md#step-1] Corriger les adaptateurs de snapshots de la PR 146 pour lire BackupVolumeInfos et les archives historiques Velero 1.13–1.18. Acceptance: fixtures sourcées normalisées avec PVC/PV, namespace et identifiants conservés; champs absents et état inconnu sans faux succès ni crash; formats historiques et identité de déduplication couverts par tests."
/orch-fix-defect "[Plan: docs/plans/pr-146-retrocompatibilite.md#step-2] Corriger BackupSnapshotsService de la PR 146: lire BackupVolumeInfos et utiliser les archives historiques disponibles en repli ou enrichissement, sans sélection fondée uniquement sur la version serveur. Acceptance: nouvelles sauvegardes 1.17/1.18 et anciennes importées lisibles; absence distinguée des 403, timeouts et données corrompues; régressions couvertes sans doublons ni téléchargements inutiles."
/orch-fix-defect "[Plan: docs/plans/pr-146-retrocompatibilite.md#step-3] Corriger API et panneau PodVolumes de la PR 146 pour conserver les résultats partiels et signaler les erreurs par source. Acceptance: panne CSI ou native sans disparition de l'autre source; transition en cours vers terminé sans doublons de volumes ou d'octets; permissions et CRD facultatives respectées sans masquer les refus d'accès, avec tests API/UI et traductions."
```
