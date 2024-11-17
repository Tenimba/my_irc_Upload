# My_IRC
RE-UPLOAD PROJET EPITECH

Une application de chat en temps réel construite avec React et Socket.IO.

## Fonctionnalités

- Messagerie en temps réel sur plusieurs canaux
- Création et gestion des canaux
- Détection de présence des utilisateurs
- Historique des messages
- Support de plusieurs canaux
- Notifications système pour les connexions/déconnexions
- Messages privés entre utilisateurs
- Commandes personnalisées pour la gestion des canaux
- Personnalisation du nom d'utilisateur

## Prérequis

- Node.js (v16)
- npm ou yarn

## Installation

1. Clonez le dépôt :
```bash
git clone <url-de-votre-dépôt>
```

2. Installez les dépendances :
```bash
# Installation des dépendances du serveur
cd server
npm install

# Installation des dépendances du client
cd ../client
npm install
```

3. Démarrez l'application :
```bash
# Démarrage du serveur (depuis le dossier server)
npm start

# Démarrage du client (depuis le dossier client)
npm start
```

## Utilisation

1. Ouvrez `http://localhost:3000` dans votre navigateur
2. Entrez un nom d'utilisateur pour vous connecter
3. Commencez à chatter dans les canaux existants ou créez-en de nouveaux
4. Changez de canal en cliquant sur leurs noms

## Commandes Disponibles

Les commandes suivantes sont disponibles dans le chat :

- `/help` - Affiche toutes les commandes disponibles
- `/msg [nom_utilisateur] [message]` - Envoie un message privé à un utilisateur spécifique
- `/create [nom_du_canal]` - Crée un nouveau canal
- `/join [nom_du_canal]` - Rejoint un canal existant
- `/delete [nom_du_canal]` - Supprime un canal
- `/list` - Affiche tous les canaux disponibles
- `/users` - Affiche tous les utilisateurs connectés
- `/nick [nouveau_pseudo]` - Change votre nom d'utilisateur

## Structure du Projet

```
my_irc/
├── client/               # Frontend React
│   ├── src/
│   │   ├── App.js       # Composant principal de l'application
│   │   └── App.css      # Styles
│   └── package.json
└── server/              # Backend Node.js
    ├── server.js        # Serveur Socket.IO
    └── package.json
```

## Technologies Utilisées

- React
- Socket.IO
- Express
- Node.js
- Tailwind CSS

## Navigation entre Canaux

Pour changer de canal, cliquez simplement sur le nom du canal dans la liste des canaux.