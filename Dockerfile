# Utilisez l'image officielle de Node.js.
FROM node:16

# Définir le répertoire de travail.
WORKDIR /app

# Copier le fichier package.json et package-lock.json.
COPY package*.json ./

# Installer les dépendances.
RUN npm ci

# Copier tout le code source du backend.
COPY back ./back

# Changer de répertoire de travail pour le backend.
WORKDIR /app/back

# Générer le client Prisma.
RUN npm run prisma generate

# Formater le schéma Prisma.
RUN npm run prisma format

# Pousser les migrations Prisma.
RUN npm run prisma db push

# Construire l'application.
RUN npm run build

# Exposer le port.
EXPOSE 3000

# Commande par défaut pour lancer l'application.
CMD ["npm", "start"]
