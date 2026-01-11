# Plugin de révision de code

Révision de code automatisée pour les requêtes de tirage (pull requests) utilisant plusieurs agents spécialisés avec une notation basée sur la confiance pour filtrer les faux positifs.

## Vue d'ensemble

Le plugin de révision de code automatise la révision des requêtes de tirage en lançant plusieurs agents en parallèle pour auditer indépendamment les changements sous différentes perspectives. Il utilise la notation de confiance pour filtrer les faux positifs, garantissant que seuls les commentaires de haute qualité et exploitables sont publiés.

## Commandes

### '/code-review'

Effectue une révision de code automatisée sur une requête de tirage en utilisant plusieurs agents spécialisés.

**Ce qu'il fait :**
1. Vérifie si une révision est nécessaire (saute les PR fermées, brouillons, triviales ou déjà révisées)
2. Recueille les fichiers de directives CLAUDE.md pertinents du dépôt
3. Résume les modifications de la requête de tirage
4. Lance 4 agents parallèles pour une révision indépendante :
   - **Agents #1 & #2** : Audit de conformité CLAUDE.md
   - **Agent #3** : Recherche les bugs évidents dans les changements
   - **Agent #4** : Analyse git blame/historique pour les problèmes liés au contexte
5. Note chaque problème de 0 à 100 pour le niveau de confiance
6. Filtre les problèmes en dessous du seuil de confiance de 80
7. Affiche la révision (par défaut dans le terminal, ou comme commentaire de PR avec l'option '--comment')

**Utilisation :**
```bash
/code-review [--comment]
```

**Options :**
 - '--comment' : Publie la révision en tant que commentaire sur la requête de tirage (par défaut : affiche uniquement dans le terminal)

**Exemple de flux de travail :**
```bash
# Sur une branche de PR, exécutez localement (affiche dans le terminal) :
/code-review

# Publiez la révision en tant que commentaire de PR :
/code-review --comment

# Claude va :
# - Lancer 4 agents de révision en parallèle
# - Noter chaque problème pour la confiance
# - Afficher les problèmes ≥80 de confiance (dans le terminal ou la PR selon l'option)
# - Sauter si aucun problème de haute confiance n'est trouvé
```

**Fonctionnalités :**
 - Plusieurs agents indépendants pour une révision complète
 - La notation basée sur la confiance réduit les faux positifs (seuil : 80)
 - Vérification de la conformité CLAUDE.md avec vérification explicite des directives
 - Détection de bugs axée sur les changements (pas les problèmes préexistants)
 - Analyse du contexte historique via git blame
 - Ignorance automatique des PR fermées, brouillons ou déjà révisées
 - Liens directs vers le code avec SHA complet et plages de lignes

**Format du commentaire de révision :**
```markdown
## Révision de code

3 problèmes trouvés :

1. Gestion des erreurs manquante pour le rappel OAuth (CLAUDE.md dit Toujours gérer les erreurs OAuth)

https://github.com/owner/repo/blob/abc123.../src/auth.ts#L67-L72

2. Fuite de mémoire : l'état OAuth n'est pas nettoyé (bug dû à l'absence de nettoyage dans le bloc finally)

https://github.com/owner/repo/blob/abc123.../src/auth.ts#L88-L95

3. Modèle de nommage incohérent (src/conventions/CLAUDE.md dit Utiliser le camelCase pour les fonctions)

https://github.com/owner/repo/blob/abc123.../src/utils.ts#L23-L28
```

**Notation de confiance :**
 - **0** : Pas confiant, faux positif
 - **25** : Assez confiant, pourrait être réel
 - **50** : Modérément confiant, réel mais mineur
 - **75** : Très confiant, réel et important
 - **100** : Absolument certain, définitivement réel

**Faux positifs filtrés :**
 - Problèmes préexistants non introduits dans la PR
 - Code qui ressemble à un bug mais n'en est pas un
 - Exigences pédantes
 - Problèmes que les linters détecteront
 - Problèmes de qualité générale (sauf si dans CLAUDE.md)
 - Problèmes avec les commentaires d'ignorance de lint

## Installation

Ce plugin est inclus dans le dépôt Claude Code. La commande est automatiquement disponible lors de l'utilisation de Claude Code.

## Bonnes pratiques

### Utilisation de '/code-review'
 - Maintenez des fichiers CLAUDE.md clairs pour une meilleure vérification de la conformité
 - Faites confiance au seuil de confiance de 80+ - les faux positifs sont filtrés
 - Exécutez sur toutes les requêtes de tirage non triviales
 - Examinez les conclusions de l'agent comme point de départ pour la révision humaine
 - Mettez à jour CLAUDE.md en fonction des modèles de révision récurrents

### Quand utiliser
 - Toutes les requêtes de tirage avec des modifications significatives
 - Les PR touchant des chemins de code critiques
 - Les PR de plusieurs contributeurs
 - Les PR où la conformité aux directives est importante

### Quand ne pas utiliser
 - Les PR fermées ou brouillons (ignorées automatiquement de toute façon)
 - Les PR automatisées triviales (ignorées automatiquement)
 - Les correctifs urgents nécessitant une fusion immédiate
 - Les PR déjà révisées (ignorées automatiquement)

## Intégration du flux de travail

### Flux de travail standard de révision de PR :
```bash
# Créez une PR avec les changements
# Exécutez une révision locale (affiche dans le terminal)
/code-review

# Examinez les commentaires automatisés
# Apportez les corrections nécessaires

# Postez éventuellement en tant que commentaire de PR
/code-review --comment

# Fusionnez lorsque prêt
```

### Dans le cadre de CI/CD :
```bash
# Déclenchez lors de la création ou de la mise à jour d'une PR
# Utilisez l'option '--comment' pour publier des commentaires de révision
/code-review --comment
# Ignorez si la révision existe déjà
```

## Exigences

 - Dépôt Git avec intégration GitHub
 - GitHub CLI ('gh') installé et authentifié
 - Fichiers CLAUDE.md (facultatif mais recommandé pour la vérification des directives)

## Dépannage

### La révision prend trop de temps

**Problème** : Les agents sont lents sur les grandes PR

**Solution** :
 - Normal pour les grands changements - les agents s'exécutent en parallèle
 - 4 agents indépendants garantissent une exhaustivité
 - Envisagez de diviser les grandes PR en plus petites

### Trop de faux positifs

**Problème** : La révision signale des problèmes qui ne sont pas réels

**Solution** :
 - Le seuil par défaut est de 80 (filtre déjà la plupart des faux positifs)
 - Rendez CLAUDE.md plus spécifique sur ce qui compte
 - Déterminez si le problème signalé est réellement valide

### Aucun commentaire de révision publié

**Problème** : '/code-review' s'exécute mais aucun commentaire n'apparaît

**Solution** :
Vérifiez si :
 - La PR est fermée (révisions ignorées)
 - La PR est un brouillon (révisions ignorées)
 - La PR est triviale/automatisée (révisions ignorées)
 - La PR a déjà une révision (révisions ignorées)
 - Aucun problème n'a été noté ≥80 (aucun commentaire nécessaire)

### Formatage des liens cassé

**Problème** : Les liens de code ne s'affichent pas correctement dans GitHub

**Solution** :
Les liens doivent suivre ce format exact :
```
https://github.com/owner/repo/blob/[full-sha]/path/file.ext#L[start]-L[end]
```
 - Doit utiliser le SHA complet (pas abrégé)
 - Doit utiliser la notation '#L'
 - Doit inclure une plage de lignes avec au moins 1 ligne de contexte

### GitHub CLI ne fonctionne pas

**Problème** : Les commandes 'gh' échouent

**Solution** :
 - Installez GitHub CLI : 'brew install gh' (macOS) ou consultez [Installation de GitHub CLI](https://cli.github.com/)
 - Authentifiez-vous : 'gh auth login'
 - Vérifiez que le dépôt a un distant GitHub

## Conseils

 - **Écrivez des fichiers CLAUDE.md spécifiques** : Des directives claires = de meilleures révisions
 - **Incluez du contexte dans les PR** : Aide les agents à comprendre l'intention
 - **Utilisez les scores de confiance** : Les problèmes ≥80 sont généralement corrects
 - **Itérez sur les directives** : Mettez à jour CLAUDE.md en fonction des modèles
 - **Révision automatique** : Configurez-la dans le cadre du flux de travail de la PR
 - **Faites confiance au filtrage** : Le seuil empêche le bruit

## Configuration

### Ajustement du seuil de confiance

Le seuil par défaut est de 80. Pour l'ajuster, modifiez le fichier de commande dans 'commands/code-review.md' :
```markdown
Filter out any issues with a score less than 80.
```

Changez '80' pour votre seuil préféré (0-100).

### Personnalisation de l'objectif de la révision

Modifiez 'commands/code-review.md' pour ajouter ou modifier les tâches de l'agent :
 - Ajoutez des agents axés sur la sécurité
 - Ajoutez des agents d'analyse des performances
 - Ajoutez des agents de vérification de l'accessibilité
 - Ajoutez des vérifications de la qualité de la documentation

## Détails techniques

### Architecture de l'agent
 - **2x agents de conformité CLAUDE.md** : Redondance pour les vérifications des directives
 - **1x détecteur de bugs** : Axé uniquement sur les bugs évidents dans les changements
 - **1x analyseur d'historique** : Contexte à partir de git blame et de l'historique
 - **Nx évaluateurs de confiance** : Un par problème pour une notation indépendante

### Système de notation
 - Chaque problème est noté indépendamment de 0 à 100
 - La notation prend en compte la force des preuves et la vérification
 - Le seuil (par défaut 80) filtre les problèmes à faible confiance
 - Pour les problèmes CLAUDE.md : vérifie que la directive le mentionne explicitement

### Intégration GitHub
Utilise l'interface de ligne de commande 'gh' pour :
 - Afficher les détails et les différences des PR
 - Récupérer les données du dépôt
 - Lire git blame et l'historique
 - Publier des commentaires de révision

## Auteur

Boris Cherny (boris @anthropic.com)

## Version

1.0.0
