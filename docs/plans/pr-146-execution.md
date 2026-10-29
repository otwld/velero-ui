# PR 146 — Rapport d'exécution

Date : 25 octobre 2026. Branche : `codex/pr-146-compat`, suivie de `lappihuan/feat/snapshot-datamover-progress`.

Les six étapes du [plan approuvé](./pr-146-retrocompatibilite.md) ont été exécutées localement. Aucun commit, push, déploiement, modification de CRD, publication de review ou fusion n'a été effectué.

## Travaux et preuves

| Étape | Résultat |
| --- | --- |
| 1 — Normalisation | Types et adaptateurs VolumeInfos ajoutés ; les valeurs historiques inconnues sont préservées. Fixtures synthétiques sourcées pour chacun des six tags 1.13.0–1.18.0. Les champs Go `Phase`/`ReadyToUse` gardent leur casse ; les archives JSON `null` sont acceptées comme slices nil. |
| 2 — Sources et replis | Lecture de VolumeInfos, repli/enrichissement historique si nécessaire. Les métadonnées complètes 1.17/1.18 ne déclenchent pas de lecture des anciens fichiers CSI. Les sauvegardes importées sont traitées selon leurs données, pas la version du serveur. |
| 3 — Résultats partiels | Contrat `{items, issues}` partagé entre API et UI ; erreurs natives et CSI isolées. Les exceptions et URL signées ne sont pas envoyées dans les issues. Les permissions, états inconnus, tailles partielles et déduplication avec les DataUploads sont couverts. |
| 4 — Validation | 64 tests API et 39 tests UI ciblés réussis ; builds et lint Nx réussis. Les nouvelles régressions ont été observées en échec avant correction. Limites globales préexistantes précisées ci-dessous. |
| 5 — Documentation | README, fonctionnalités, RBAC et traductions en/fr/ru/zh mis à jour. Origine des sauvegardes, formats historiques, permissions et limites des validations simulées expliquées. |
| 6 — Review | Reviews indépendantes du code et de la sécurité réalisées sur le diff local ; aucun défaut actionnable ou bloquant relevé. Vérification TypeScript supplémentaire : aucune nouvelle erreur par rapport au commit initial. |

Les tests vérifient notamment les archives CSI absentes en 1.17/1.18, les champs absents en 1.13/1.14, les anciennes sauvegardes importées, les sauvegardes mixtes et data mover, les CRD facultatives absentes, les erreurs 403/404/500/504, les réponses gzip/JSON invalides, les noms/UID, le maintien des résultats disponibles et le passage du suivi live aux archives. Une régression UI vérifie aussi qu'une requête désactivée pour manque de permission n'expose pas des données présentes dans le cache.

## Commandes de validation

```bash
npx nx run velero-ui-api:test --runInBand --testPathPatterns='backup-snapshots|download-request.service|security|k8s-custom-object.service'
npx nx run velero-ui:test --run --testNamePattern='volume|snapshot|menu|data mover' --reportsDirectory=coverage/apps/velero-ui --coverage
npx nx affected -t lint --base=a7e23f275aeafdb0b64db3fdce1f74fa853d677f
npx nx run velero-ui:build
```

- API : 5 suites, 64 tests réussis.
- UI ciblée : 9 fichiers, 39 tests réussis ; les 2 tests hors filtre ne sont pas comptés comme validés.
- Build : UI et API, plus les bibliothèques `velero` et `shared-types`, réussis.
- Lint : 4 projets affectés, aucune erreur ; avertissements existants. Les deux tâches valides en cache ont été réutilisées lors de la dernière validation.
- Aucun cache Nx local/distant ni daemon désactivé ; aucun `nx reset`. Le chemin de rapport UI est fourni dans la commande afin de rester dans le workspace.

Couverture mesurée sur les fichiers UI de production corrigés :

| Fichier | Instructions | Fonctions | Branches |
| --- | ---: | ---: | ---: |
| PodVolumes.vue | 96,92 % | 96,55 % | 81,82 % |
| SnapshotLine.vue | 100 % | 100 % | 96,15 % |
| DataMoverLine.vue | 100 % | 100 % | 89,80 % |
| useVolumeOperations.ts | 92,31 % | 100 % | 85,71 % |

La mesure backend ciblée des nouveaux adaptateurs, du service snapshots et du service DownloadRequest atteint également au moins 80 % des branches. La couverture globale du dépôt n'est pas présentée comme supérieure à 80 % : les suites ciblées ne couvrent pas tous les modules existants.

## Limites et problèmes préexistants

- Aucun essai sur un cluster réel. Les fixtures et réponses Kubernetes/stockage sont simulées et ne certifient pas tous les patchs Velero, plugins ou fournisseurs de stockage.
- La suite UI complète a été exécutée : `src/App.spec.ts` échoue parce qu'il attend encore `Welcome velero-ui 👋`, absent de `App.vue` qui contient un `router-view`. Ces fichiers sont inchangés. Ce test n'a pas été masqué ni réécrit pour faire passer la suite.
- `vue-tsc --noEmit -p apps/velero-ui/tsconfig.app.json` échoue sur 59 erreurs préexistantes. Le même contrôle a été exécuté sur une copie du commit initial `a7e23f2` : les 59 diagnostics sont identiques, sans nouveau diagnostic dans la correction. Le build Vite du projet est configuré avec `skipTypeCheck` ; sa réussite ne vaut donc pas réussite de ce contrôle global.
- Les tests de permissions du contrôleur sont des tests unitaires des règles et du contrat ; ils ne constituent pas un essai HTTP authentifié sur une instance déployée.
- Aucune compatibilité supplémentaire n'est promise avant Velero 1.13 ou au-delà de 1.18. Les menus dédiés aux transferts continuent de lire les ressources live ; ils ne reconstituent pas l'historique des transferts supprimés.

Les modifications restent disponibles dans le checkout pour inspection et intégration à la PR.

## Correction complémentaire — rétablissement du temps réel

Après signalement du rafraîchissement périodique par l'utilisateur, les menus `/pod-volumes/backups` et `/pod-volumes/restores` ont été corrigés. Le polling des listes est supprimé : les snapshots HTTP initiaux sont maintenus par les événements WebSocket des volumes filesystem, des DataUploads/DataDownloads et des parents Restore autorisés. Les filtres, compteurs et pages sont recalculés dans le cache, sans activer les animations de chargement lors d'un événement.

Le backend ne conservait qu'un watch par connexion. Il conserve désormais les abonnements par client, ressource et nom ; les désabonnements actuels indiquent la ressource exacte et la déconnexion libère tous les flux. Un abonnement annulé ou remplacé pendant sa création ne laisse plus de contrôleur actif. Les streams Kubernetes fermés reprennent à leur dernière révision, les expirations 410 déclenchent un nouveau snapshot de la source concernée, et les erreurs terminales restent identifiables. Le contrôle JWT et l'autorisation par ressource sont conservés ; le mode public explicitement configuré ne tente plus de lire un utilisateur JWT absent.

Les régressions ont été observées en échec avant correction : absence de watch, requêtes HTTP périodiques et arrêt du flux filesystem lorsque le flux data mover démarrait.

Validations supplémentaires réussies :

```bash
npx nx run velero-ui:test --run --testFiles=usePodVolumeList.spec.ts,PodVolumeMenus.spec.ts --reportsDirectory=coverage/apps/velero-ui
npx nx run velero-ui-api:test --runInBand --testPathPatterns=k8s-custom-object
npx nx affected -t lint --base=a7e23f275aeafdb0b64db3fdce1f74fa853d677f
npx nx run velero-ui:build
```

- 19 tests UI ciblés : événements simulés, progression et lignes visibles, absence d'animation périodique, aucune requête de polling après 60 secondes, filtres/pagination, reconnexions, permissions, erreurs et nettoyage des listeners.
- 14 tests API ciblés : abonnements simultanés, clients/noms isolés, annulation pendant la création, remplacement, reprises, bookmarks, expiration, permissions et mode public.
- Build UI/API et lint des projets affectés réussis, avec caches Nx conservés et résultats valides réutilisés.
- Reviews indépendantes du code et de la sécurité sans défaut bloquant identifié.
- Vérification TypeScript : toujours 59 diagnostics préexistants, aucun dans le composable modifié. Aucun test sur cluster réel et aucun commit/push supplémentaire.

Les chiffres de la section initiale décrivent la validation de rétrocompatibilité à cette étape du travail ; les chiffres ci-dessus décrivent le périmètre ciblé de la correction temps réel, sans les additionner comme une nouvelle suite globale.

## Correction complémentaire — pagination serveur des menus

La première correction du temps réel conservait toutes les opérations dans le navigateur et y découpait les pages. Cette approche a été remplacée : les endpoints `/pod-volumes/backups` et `/pod-volumes/restores` fusionnent les seules sources autorisées, appliquent recherche, filtres et tri, puis renvoient la page demandée avec son total. La taille par défaut est 20 et le maximum 100, y compris si un ancien client demande `limit=0`.

Les WebSockets transmettent une page bornée et ses compteurs. Le serveur partage un cache et un watch Kubernetes par source, coalesce les événements et libère les sources inutilisées après 30 secondes. La liste complète reste en mémoire côté serveur pour permettre le tri et les filtres globaux ; elle n'est pas retransférée au navigateur ni relue sur Kubernetes à chaque page ou événement. Les erreurs de source restent visibles dans l'interface.

Les tests de régression frontend ont d'abord échoué avec l'ancienne implémentation. Les validations couvrent notamment 10 000 entrées pour 20 lignes reçues, le changement de page côté API, les pages WS et événements périmés, la reconnexion, l'absence de polling, la suppression de la dernière page et les anciennes préférences de limite excessive.

Le chemin `outputs` du target de test UI déclarait à tort un dossier hors workspace (`../../coverage/...`) et faisait échouer l'enregistrement du cache après des tests réussis. Il pointe désormais explicitement sur `{workspaceRoot}/coverage/apps/velero-ui` ; les caches Nx restent activés.

Validations de pagination réussies :

- 22 tests UI ciblés (`usePodVolumeList`, `PodVolumeMenus`, utilitaires de liste), dont le scénario de 10 000 entrées et le maintien des 20 lignes via HTTP/WebSocket.
- `nx affected -t lint --base=a7e23f275aeafdb0b64db3fdce1f74fa853d677f` : quatre projets validés, caches conservés.
- `nx run velero-ui:build`, puis `nx run velero-ui-api:build` après la dernière correction d'autorisation WebSocket : réussis. Les résultats valides des dépendances sont réutilisés par Nx.
- Revues indépendantes du code et de la sécurité terminées. La revue a fait corriger la remontée des pages partielles et la limite effective du store.
- Contrôle global Vue TypeScript : les 59 diagnostics préexistants persistent, sans nouveau diagnostic sur cette correction. Aucun essai sur cluster réel et aucun commit/push.
- 30 tests API supplémentaires sur deux suites : pagination/filtres/tri globaux, limites, 10 000 entrées, pages WS, cache partagé et facettes, isolation sur cache chaud, droits des parents Restore, validation HTTP/WS, 410/403, expiration, déconnexion pendant chargement et réponses périmées. Commande : `npx nx run velero-ui-api:test --runInBand --testPathPatterns='pod-volume-list' --coverage --collectCoverageFrom='src/app/modules/pod-volume-list/*.ts'`. Le bootstrap Nest n'est pas testé par ces suites unitaires.

## Corrections de review — P1 et P2

P1 : les panneaux de détail n'appellent plus les collections globales d'opérations et ne les rechargent plus toutes les cinq secondes. Un endpoint dédié vérifie le droit de lecture de la ressource et transmet à Kubernetes un sélecteur sur le nom du parent, puis parcourt uniquement les pages de ce parent (`limit=100`, `continue`). Le UID/propriétaire est vérifié ; les noms longs utilisent le hash Velero. Les mises à jour passent ensuite par un watch Kubernetes filtré sur le même parent, avec abonnements WebSocket indépendants des menus et nettoyage des événements tardifs. Les métadonnées de snapshots d'une sauvegarde en cours conservent leur actualisation spécifique ; elles ne constituent pas un rechargement global des opérations.

P2 : un rechargement de source échoué après expiration du watch est réessayé automatiquement tant qu'il reste des abonnés. Les délais sont progressifs et plafonnés à 30 secondes ; les timers sont annulés après succès, dernier désabonnement ou destruction. Les erreurs de permission et les CRD absentes ne déclenchent pas de retry automatique. Les watches Kubernetes reprennent également sur les refus temporaires 408/429, en conservant leur révision et leur sélecteur. Une source saine ne déclenche aucune requête HTTP périodique.

Les régressions ont d'abord été observées en échec : requêtes globales périodiques dans le détail, arrêt des mises à jour après 410 puis erreur de rechargement, et arrêt des watches après 408/429. Validations finales :

- 33 tests UI ciblés : `npx nx run velero-ui:test --testFiles=src/composables/useVolumeOperations.spec.ts,src/components/PodVolume/PodVolumes.spec.ts,src/composables/usePodVolumeList.spec.ts,src/components/PodVolume/PodVolumeMenus.spec.ts`.
- 69 tests API dans 7 suites : `npx nx run velero-ui-api:test --runInBand '--testPathPatterns=pod-volume-list|k8s-custom-object'`.
- Build UI/API réussi : `npx nx run velero-ui:build`.
- Lint des quatre projets affectés réussi : `npx nx affected -t lint --base=a7e23f275aeafdb0b64db3fdce1f74fa853d677f`.
- Caches Nx conservés ; résultats de dépendances valides réutilisés. Le contrôle global Vue TypeScript conserve ses 59 diagnostics préexistants, aucun sur les fichiers de cette correction.
- Revue indépendante du code et de la sécurité effectuée ; le cas 408/429 découvert pendant la revue est corrigé et couvert.

Ces changements corrigent les deux findings de review ; ils ne branchent pas la pagination native Kubernetes sur les menus fusionnés. Aucun test sur cluster réel, aucun commit ni push.

## Correction de review — reprise des détails après panne prolongée

Le composable des détails ne limite plus à trois tentatives les erreurs Axios transitoires (réseau, HTTP 408/429/5xx). Tant que le panneau reste monté, les reprises utilisent un délai progressif de 1/2/4/8/16 secondes, puis 30 secondes maximum. L'erreur reste visible pendant la panne et disparaît après rétablissement. Le watch reprend depuis la révision du nouveau snapshot ; il n'y a plus de requêtes périodiques une fois le suivi rétabli. Les requêtes utilisent leur AbortSignal afin d'annuler les tentatives lors du changement de parent ou du démontage. Les erreurs terminales, notamment 403 et la CRD facultative absente en 404, arrêtent les reprises.

TDD : deux tests rouges ont reproduit l'arrêt après quatre requêtes et l'absence de reprise après 15 secondes d'indisponibilité. Validation finale : 22 tests ciblés réussis (`useVolumeOperations.spec.ts` : 17, `PodVolumes.spec.ts` : 5), couvrant aussi le délai plafonné, la progression WebSocket après rétablissement, l'annulation et les réponses terminales. Lint UI réussi, caches Nx conservés. Revue indépendante sans nouveau défaut identifié. Aucun fichier backend modifié pour cette correction ; aucun commit ni push.
