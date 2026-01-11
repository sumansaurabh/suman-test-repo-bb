# Plugin de Révision de Code

Révision de code automatisée pour les pull requests utilisant plusieurs agents spécialisés avec un score de confiance pour filtrer les faux positifs.

## Vue d'ensemble

Le Plugin de Révision de Code automatise la révision des pull requests en lançant plusieurs agents en parallèle pour auditer indépendamment les changements sous différentes perspectives. Il utilise un score de confiance pour filtrer les faux positifs, garantissant que seul un feedback de haute qualité et exploitable est publié.

## Commandes

### '/code-review'

Effectue une révision de code automatisée sur une pull request à l'aide de plusieurs agents spécialisés.

**Ce qu'il fait :**
1. Vérifie si une révision est nécessaire (ignore les PR fermées, brouillons, triviales ou déjà révisées)
2. Rassemble les fichiers de directives CLAUDE.md pertinents du dépôt
3. Résume les changements de la pull request
4. Lance 4 agents parallèles pour réviser indépendamment :
   - **Agents #1 & #2** : Audit de la conformité à CLAUDE.md
   - **Agent #3** : Recherche de bugs évidents dans les changements
   - **Agent #4** : Analyse de git blame/historique pour les problèmes basés sur le contexte
5. Score chaque problème de 0 à 100 pour le niveau de confiance
6. Filtre les problèmes en dessous du seuil de confiance de 80
7. Affiche la révision (par défaut dans le terminal, ou comme commentaire de PR avec le drapeau '--comment')

**Utilisation :**
'''bash
/code-review [--comment]
'''

**Options :**
 - '--comment' : Publie la révision en tant que commentaire sur la pull request (par défaut : affiche uniquement dans le terminal)

**Exemple de flux de travail :**
'''bash
# Sur une branche de PR, exécutez localement (affiche dans le terminal) :
/code-review

# Publier la révision en tant que commentaire de PR :
/code-review --comment

# Claude fera :
# - Lancer 4 agents de révision en parallèle
# - Attribuer un score de confiance à chaque problème
# - Afficher les problèmes ≥80 de confiance (dans le terminal ou la PR selon le drapeau)
# - Ignorer si aucun problème de haute confiance n'est trouvé
'''

**Fonctionnalités :**
 - Plusieurs agents indépendants pour une révision complète
 - Le score basé sur la confiance réduit les faux positifs (seuil : 80)
 - Vérification de la conformité à CLAUDE.md avec vérification explicite des directives
 - Détection de bugs axée sur les changements (pas les problèmes préexistants)
 - Analyse du contexte historique via git blame
 - Ignorer automatiquement les PR fermées, brouillons ou déjà révisées
 - Liens directs vers le code avec SHA complet et plages de lignes

**Format du commentaire de révision :**
'''markdown
## Révision de code

3 problèmes trouvés :

1. Gestion des erreurs manquante pour le callback OAuth (CLAUDE.md dit "Toujours gérer les erreurs OAuth")

https://github.com/owner/repo/blob/abc123.../src/auth.ts#L67-L72

2. Fuite de mémoire : l'état OAuth n'est pas nettoyé (bug dû à un nettoyage manquant dans le bloc finally)

https://github.com/owner/repo/blob/abc123.../src/auth.ts#L88-L95

3. Modèle de nommage incohérent (src/conventions/CLAUDE.md dit "Utiliser camelCase pour les fonctions")

https://github.com/owner/repo/blob/abc123.../src/utils.ts#L23-L28
'''

**Score de confiance :**
 - **0** : Pas confiant, faux positif
 - **25** : Assez confiant, pourrait être réel
 - **50** : Modérément confiant, réel mais mineur
 - **75** : Très confiant, réel et important
 - **100** : Absolument certain, définitivement réel

**Faux positifs filtrés :**
 - Problèmes préexistants non introduits dans la PR
 - Code qui ressemble à un bug mais n'en est pas un
 - Chicanes pédantes
 - Problèmes que les linters attraperont
 - Problèmes de qualité générale (sauf si dans CLAUDE.md)
 - Problèmes avec les commentaires d'ignorance de lint

## Installation

Ce plugin est inclus dans le dépôt Claude Code. La commande est automatiquement disponible lors de l'utilisation de Claude Code.

## Bonnes Pratiques

### Utilisation de '/code-review'
 - Maintenez des fichiers CLAUDE.md clairs pour une meilleure vérification de la conformité
 - Faites confiance au seuil de confiance de 80+ - les faux positifs sont filtrés
 - Exécutez sur toutes les pull requests non triviales
 - Examinez les conclusions de l'agent comme point de départ pour la révision humaine
 - Effectuez les corrections nécessaires
 - Publiez éventuellement en tant que commentaire de PR
 - Fusionnez lorsque prêt
 - Mettez à jour CLAUDE.md en fonction des modèles de révision récurrents

### Quand utiliser
 - Toutes les pull requests avec des changements significatifs
 - Les PRs touchant des chemins de code critiques
 - Les PRs de plusieurs contributeurs
 - Les PRs où la conformité aux directives est importante

### Quand ne pas utiliser
 - PRs fermées ou brouillons (automatiquement ignorées de toute façon)
 - PRs automatisées triviales (automatiquement ignorées)
 - Correctifs urgents nécessitant une fusion immédiate
 - PRs déjà révisées (automatiquement ignorées)

## Intégration du flux de travail

### Flux de travail de révision de PR standard :
'''bash
# Créer une PR avec des changements
# Exécuter une révision locale (affiche dans le terminal)
/code-review

# Examiner les commentaires automatisés
# Effectuer les corrections nécessaires

# Publier éventuellement en tant que commentaire de PR
/code-review --comment

# Fusionner lorsque prêt
'''

### Dans le cadre de CI/CD :
'''bash
# Déclencher lors de la création ou de la mise à jour de la PR
# Utiliser le drapeau --comment pour publier les commentaires de révision
/code-review --comment
# Ignorer si la révision existe déjà
'''

## Exigences

 - Dépôt Git avec intégration GitHub
 - GitHub CLI ('gh') installé et authentifié
 - Fichiers CLAUDE.md (facultatif mais recommandé pour la vérification des directives)

## Dépannage

### La révision prend trop de temps

**Problème** : Les agents sont lents sur les grandes PRs

**Solution** :
 - Normal pour les grands changements - les agents s'exécutent en parallèle
 - 4 agents indépendants garantissent une exhaustivité
 - Envisagez de diviser les grandes PRs en plus petites

### Trop de faux positifs

**Problème** : La révision signale des problèmes qui ne sont pas réels

**Solution** :
 - Le seuil par défaut est de 80 (filtre déjà la plupart des faux positifs)
 - Rendre CLAUDE.md plus spécifique sur ce qui compte
 - Déterminez si le problème signalé est réellement valide

### Aucun commentaire de révision publié

**Problème** : '/code-review' s'exécute mais aucun commentaire n'apparaît

**Solution** :
Vérifiez si :
 - La PR est fermée (révisions ignorées)
 - La PR est un brouillon (révisions ignorées)
 - La PR est triviale/automatisée (révisions ignorées)
 - La PR a déjà une révision (révisions ignorées)
 - Aucun problème n'a un score ≥80 (aucun commentaire nécessaire)

### Formatage des liens rompu

**Problème** : Les liens de code ne s'affichent pas correctement dans GitHub

**Solution** :
Les liens doivent suivre ce format exact :
'''
https://github.com/owner/repo/blob/[full-sha]/path/file.ext#L[start]-L[end]
'''
 - Doit utiliser le SHA complet (non abrégé)
 - Doit utiliser la notation '#L'
 - Doit inclure la plage de lignes avec au moins 1 ligne de contexte

### GitHub CLI ne fonctionne pas

**Problème** : Les commandes 'gh' échouent

**Solution** :
 - Installer GitHub CLI : 'brew install gh' (macOS) ou voir [installation de GitHub CLI](https://cli.github.com/)
 - S'authentifier : 'gh auth login'
 - Vérifier que le dépôt a un distant GitHub

## Conseils

 - **Rédigez des fichiers CLAUDE.md spécifiques** : Des directives claires = de meilleures révisions
 - **Incluez du contexte dans les PRs** : Aide les agents à comprendre l'intention
 - **Utilisez les scores de confiance** : Les problèmes ≥80 sont généralement corrects
 - **Itérez sur les directives** : Mettez à jour CLAUDE.md en fonction des modèles
 - **Réviser automatiquement** : Configurez comme faisant partie du flux de travail de PR
 - **Faites confiance au filtrage** : Le seuil empêche le bruit

## Détails Techniques

### Architecture de l'agent
 - **2x agents de conformité CLAUDE.md** : Redondance pour les vérifications de directives
 - **1x détecteur de bugs** : Axé uniquement sur les bugs évidents dans les changements
 - **1x analyseur d'historique** : Contexte à partir de git blame et de l'historique
 - **Nx scoreurs de confiance** : Un par problème pour un score indépendant

### Système de notation
 - Chaque problème est noté indépendamment de 0 à 100
 - La notation prend en compte la force des preuves et la vérification
 - Le seuil (80 par défaut) filtre les problèmes de faible confiance
 - Pour les problèmes CLAUDE.md : vérifie que la directive le mentionne explicitement

### Intégration GitHub
Utilise 'gh' CLI pour :
 - Afficher les détails et les différences de la PR
 - Récupérer les données du dépôt
 - Lire git blame et l'historique
 - Publier des commentaires de révision

## Auteur

Boris Cherny (boris @anthropic.com)

## Version

1.0.0