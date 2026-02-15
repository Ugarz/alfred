# Déploiement du Bot Alfred sur VPS (Ubuntu 24.04)

Ce guide explique comment déployer et maintenir le bot Alfred en ligne 24/7 sur un serveur Ubuntu en utilisant **PM2**.

## 1. Prérequis sur le VPS

Connectez-vous à votre VPS en SSH.

### Installer Node.js (via NVM recommandé) ou via APT
Ubuntu 24.04 propose des versions récentes de Node.js, mais NVM offre plus de flexibilité.

```bash
# Installation de Node.js (version 24 recommandée comme spécifié dans package.json)
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node -v
npm -v
```

### Installer pnpm et pm2
```bash
# Installer pnpm globalement
sudo npm install -g pnpm

# Installer PM2 globalement (gestionnaire de processus)
sudo npm install -g pm2
```

## 2. Installation du projet

```bash
# Cloner le repo (remplacez l'URL par la vôtre)
git clone https://github.com/votre-user/alfred.git
cd alfred

# Installer les dépendances
pnpm install

# Créer le fichier .env
cp .env.example .env
nano .env
# Remplissez votre TOKEN, CLIENT_ID, etc.
```

## 3. Build et Déploiement des commandes

À chaque mise à jour du code, il faut recompiler.

```bash
# Compiler le TypeScript en JavaScript
pnpm run build

# Enregistrer les commandes slash sur Discord (si elles ont changé)
pnpm run deploy
```

## 4. Lancement avec PM2

PM2 va gérer le processus, le redémarrer en cas de crash, et gérer les logs.

```bash
# Lancer le bot via la configuration ecosystem.config.js
pm2 start ecosystem.config.js

# Vérifier que le bot tourne
pm2 list
pm2 logs alfred
```

### Rendre le lancement persistant au redémarrage du VPS

C'est l'étape cruciale pour que le bot redémarre si le serveur reboot.

```bash
# Générer le script de startup (copiez/collez la commande que PM2 vous donne)
pm2 startup

# Sauvegarder la liste actuelle des processus
pm2 save
```

## 5. Mises à jour futures

Pour mettre à jour le bot plus tard :

```bash
# 1. Récupérer le code
git pull

# 2. Installer les nouvelles dépendances si besoin
pnpm install

# 3. Recompiler
pnpm run build

# 4. Redémarrer le processus PM2
pm2 restart alfred
```

## Notes sur la base de données
Le bot utilise `alfred.db` (SQLite). Ce fichier est stocké localement.
- **Attention** : Si vous supprimez le dossier, vous perdez la base de données.
- Pensez à faire des backups de `alfred.db` de temps en temps.
