
# Projet Rave

Ce projet est une application React Native pour l'enregistrement, la gestion et la conversion d'audios. L'application permet d'enregistrer des audios, de les sélectionner, de les envoyer à un serveur pour conversion, et de gérer les audios convertis.

## Lancement de l'application

1. Démarrez l'application Expo :

   ```bash
   yarn start
   ```

2. Suivez les instructions pour lancer l'application sur un appareil physique ou un simulateur/emulateur.

## Structure du projet

- \`components/\` : Contient les composants réutilisables.
- \`screens/\` : Contient les différentes pages de l'application.
- \`store/\` : Contient les slices Redux pour gérer l'état de l'application.

## Fonctionnalités

### Enregistrement audio

L'application permet d'enregistrer des audios via le composant \`RecordScreen\`. Les utilisateurs peuvent démarrer et arrêter l'enregistrement, puis sauvegarder ou supprimer l'enregistrement.

### Sélection et lecture d'audios

L'application permet de sélectionner des audios enregistrés ou présents sur l'appareil via le composant \`SelectAudio\`. Les utilisateurs peuvent lire, supprimer ou sélectionner un fichier audio.

### Conversion d'audios

L'application permet d'envoyer des audios à un serveur pour conversion et de télécharger les audios convertis via le composant \`ModelSelection\`. Les utilisateurs peuvent choisir un modèle de conversion, transférer l'audio et télécharger l'audio converti.

### Gestion des audios convertis

L'application permet de lire et de supprimer des audios convertis via le composant \`ConvertedAudios\`. Les utilisateurs peuvent visualiser la liste des audios convertis, les lire ou les supprimer.

## Réducteurs Redux

### \`audioSlice\`

Gère l'état des enregistrements audio, de l'audio sélectionné et des audios convertis. Permet d'ajouter, de supprimer et de sélectionner des audios, ainsi que de gérer les audios convertis.

### \`modelSlice\`

Gère l'état des modèles disponibles et du modèle sélectionné. Permet de définir la liste des modèles et de sélectionner un modèle spécifique.

### \`serverSlice\`

Gère l'état des informations du serveur, y compris l'adresse IP et le port. Permet de mettre à jour l'adresse IP du serveur et le port utilisés pour les connexions.

## Lancement en production

Pour lancer le build de l'application, cliquez [ici](https://expo.dev/preview/update?message=update%20converted%20audio&updateRuntimeVersion=1.0.0&createdAt=2024-06-23T16%3A15%3A33.791Z&slug=exp&projectId=20d35b73-f9e5-4d8a-802d-de04da22fb07&group=b36ced8a-70b4-4524-b8dc-cf296896a167).




