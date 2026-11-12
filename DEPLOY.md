# Déploiement

Chaque push sur `main` (ou un lancement manuel depuis l'onglet **Actions → Deploy to Infomaniak → Run workflow**) build le site dans GitHub Actions et synchronise `dist/` sur l'hébergement Infomaniak via SSH/rsync.

Workflow : [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

> ⚠️ Le dossier cible est un **miroir** de `dist/` : tout fichier absent du build y est supprimé, sauf `.htaccess`, `.well-known/`, `.user.ini` et `cgi-bin/`. Ce dossier ne doit contenir que ce site.

## Configuration initiale (une seule fois)

### 1. Activer SSH chez Infomaniak

Manager Infomaniak → Hébergement Web → ton hébergement → **FTP / SSH**. Vérifie que l'utilisateur a l'accès SSH activé et note :

- l'**hôte** (ex. `xxxx.ftp.infomaniak.com`)
- le **nom d'utilisateur**
- le **chemin du site** (dossier racine du domaine, ex. `/home/clients/<id>/sites/basile-kamm.ch`) — visible dans Manager → Sites → le site → *Dossier*, ou via `pwd` une fois connecté.

### 2. Créer une clé SSH dédiée au déploiement

En local :

```sh
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/infomaniak_deploy -N ""
```

Ajoute la clé **publique** sur le serveur :

```sh
ssh-copy-id -i ~/.ssh/infomaniak_deploy.pub UTILISATEUR@HÔTE
# ou ajoute le contenu de infomaniak_deploy.pub dans ~/.ssh/authorized_keys sur le serveur
```

Teste : `ssh -i ~/.ssh/infomaniak_deploy UTILISATEUR@HÔTE` doit se connecter sans mot de passe.

### 3. Récupérer l'empreinte du serveur

```sh
ssh-keyscan -p 22 HÔTE
```

Copie la sortie complète (toutes les lignes).

### 4. Ajouter les secrets GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret** :

| Secret            | Valeur                                                   |
| ----------------- | -------------------------------------------------------- |
| `SSH_HOST`        | hôte Infomaniak                                          |
| `SSH_USER`        | utilisateur SSH                                          |
| `SSH_PRIVATE_KEY` | contenu de `~/.ssh/infomaniak_deploy` (clé **privée**)   |
| `SSH_KNOWN_HOSTS` | sortie de `ssh-keyscan` (étape 3)                        |
| `DEPLOY_PATH`     | chemin absolu du dossier du site                         |
| `SSH_PORT`        | *(optionnel)* port SSH, `22` par défaut                  |

## Déployer

```sh
git switch main
git merge --ff-only dev
git push origin main
```

Suivi dans l'onglet **Actions** du repo.

## Révoquer l'accès

Supprime la ligne `github-deploy` du fichier `~/.ssh/authorized_keys` sur le serveur, puis le secret `SSH_PRIVATE_KEY` sur GitHub.
