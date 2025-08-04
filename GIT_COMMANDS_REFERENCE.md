# 📚 RÉFÉRENCE DES COMMANDES GIT
*Guide de référence pour la gestion des versions avec Git*

---

## 🔧 COMMANDES DE BASE

### Initialisation et Configuration
```bash
git init                                    # Initialiser un nouveau dépôt Git
git config --global user.name "Votre Nom"  # Configurer le nom utilisateur
git config --global user.email "email@example.com"  # Configurer l'email
git config --list                          # Voir la configuration actuelle
```

### État et Informations
```bash
git status                                  # Voir l'état des fichiers
git log                                     # Historique des commits
git log --oneline                          # Historique compact
git log --oneline -5                       # 5 derniers commits
git diff                                    # Voir les modifications non stagées
git diff --staged                          # Voir les modifications stagées
```

---

## 📁 GESTION DES FICHIERS

### Ajouter et Commiter
```bash
git add .                                   # Ajouter tous les fichiers modifiés
git add fichier.txt                        # Ajouter un fichier spécifique
git add *.py                               # Ajouter tous les fichiers Python
git commit -m "Message de commit"          # Créer un commit avec message
git commit -am "Message"                   # Ajouter et commiter en une fois
```

### Annulation et Restauration
```bash
git restore fichier.txt                    # Annuler les modifications d'un fichier
git restore --staged fichier.txt          # Désindexer un fichier
git reset HEAD~1                           # Annuler le dernier commit (garder les changements)
git reset --soft HEAD~1                   # Annuler le commit (garder en staging)
git reset --hard HEAD~1                   # Annuler le commit (perdre les changements)
```

---

## 🌿 GESTION DES BRANCHES

### Créer et Naviguer
```bash
git branch                                  # Lister les branches locales
git branch -a                             # Lister toutes les branches (locales et distantes)
git branch nom-branche                     # Créer une nouvelle branche
git checkout nom-branche                   # Basculer vers une branche
git checkout -b nouvelle-branche           # Créer ET basculer vers une nouvelle branche
git switch nom-branche                     # Basculer vers une branche (nouvelle syntaxe)
git switch -c nouvelle-branche             # Créer ET basculer (nouvelle syntaxe)
```

### Fusionner et Supprimer
```bash
git merge nom-branche                      # Fusionner une branche dans la branche actuelle
git branch -d nom-branche                  # Supprimer une branche (safe)
git branch -D nom-branche                  # Forcer la suppression d'une branche
git rebase main                            # Rebaser la branche actuelle sur main
```

---

## 🌐 TRAVAIL AVEC LES DÉPÔTS DISTANTS

### Configuration Initiale
```bash
git remote add origin https://github.com/user/repo.git  # Ajouter un dépôt distant
git remote -v                             # Voir les dépôts distants configurés
git remote set-url origin nouvelle-url    # Changer l'URL du dépôt distant
```

### Synchronisation
```bash
git fetch                                  # Récupérer les données distantes
git pull                                   # Récupérer et fusionner (fetch + merge)
git pull origin main                      # Pull depuis une branche spécifique
git push                                   # Pousser vers le dépôt distant
git push origin nom-branche               # Pousser une branche spécifique
git push --set-upstream origin nom-branche # Pousser et configurer le suivi
git push -u origin nom-branche            # Version courte de la commande précédente
```

---

## 🔄 COMMANDES UTILISÉES DANS NOTRE SESSION

### Séquence Complète Utilisée
```bash
# 1. Vérification de l'état initial
git status

# 2. Annulation du commit local précédent
git reset --soft HEAD~1

# 3. Création et basculement vers la branche muRAG
git checkout -b muRAG

# 4. Ajout de tous les fichiers
git add .

# 5. Commit des changements
git commit -m "MuRag system + Faithfulness metric"

# 6. Push initial avec configuration du suivi
git push --set-upstream origin muRAG
```

### Vérifications Utiles
```bash
git log --oneline -3                       # Voir les 3 derniers commits
git branch -a                             # Voir toutes les branches
git remote show origin                     # Informations détaillées sur origin
```

---

## 🚨 SITUATIONS D'URGENCE

### Annuler des Commits
```bash
# Annuler le dernier commit (garder les modifications)
git reset HEAD~1

# Annuler plusieurs commits
git reset HEAD~3

# Annuler et perdre toutes les modifications
git reset --hard HEAD~1

# Créer un commit qui annule un commit précédent
git revert HEAD
git revert <commit-hash>
```

### Problèmes de Push
```bash
# Si le push est rejeté (behind)
git pull --rebase origin main
git push

# Forcer un push (ATTENTION: dangereux)
git push --force-with-lease

# Configurer le push automatique pour les nouvelles branches
git config --global push.autoSetupRemote true
```

### Nettoyage
```bash
git clean -n                              # Voir les fichiers non suivis à supprimer
git clean -f                              # Supprimer les fichiers non suivis
git clean -fd                             # Supprimer fichiers et dossiers non suivis
git stash                                 # Mettre de côté les modifications
git stash pop                             # Récupérer les modifications mises de côté
git stash list                            # Voir la liste des stash
```

---

## 🔍 COMMANDES D'INVESTIGATION

### Recherche et Historique
```bash
git blame fichier.txt                     # Voir qui a modifié chaque ligne
git show <commit-hash>                    # Voir les détails d'un commit
git grep "texte"                          # Rechercher du texte dans le dépôt
git log --grep="motclé"                   # Rechercher dans les messages de commit
git log --author="nom"                    # Commits d'un auteur spécifique
git log --since="2 weeks ago"             # Commits récents
```

### Comparaisons
```bash
git diff HEAD~1                           # Comparer avec le commit précédent
git diff main..feature                    # Comparer deux branches
git diff --name-only                      # Voir seulement les noms des fichiers modifiés
```

---

## 📋 BONNES PRATIQUES

### Messages de Commit
```bash
# Format recommandé:
git commit -m "Type: Description courte"

# Exemples:
git commit -m "feat: Ajouter système RAG avec VLM"
git commit -m "fix: Corriger bug dans evaluate_faithfulness"
git commit -m "docs: Mettre à jour README avec instructions"
git commit -m "refactor: Réorganiser les fonctions d'analyse"
```

### Workflow Recommandé
```bash
# 1. Commencer une nouvelle fonctionnalité
git checkout main
git pull origin main
git checkout -b feature/nouvelle-fonctionnalite

# 2. Développer et commiter régulièrement
git add .
git commit -m "Description des changements"

# 3. Pousser et créer une Pull Request
git push -u origin feature/nouvelle-fonctionnalite

# 4. Après merge, nettoyer
git checkout main
git pull origin main
git branch -d feature/nouvelle-fonctionnalite
```

---

## 🛠️ CONFIGURATION AVANCÉE

### Alias Utiles
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.lg "log --oneline --graph --all"
```

### Configuration Push
```bash
# Push automatique pour nouvelles branches
git config --global push.autoSetupRemote true

# Push simple (branche courante seulement)
git config --global push.default simple
```

---

*📝 Créé le 23 juillet 2025 - Projet muRAG*
*🔄 Mettre à jour ce fichier avec de nouvelles commandes découvertes*
