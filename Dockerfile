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

# Installer Prisma CLI
RUN npm install prisma --save-dev

# Générer le client Prisma.
RUN npx prisma generate

# Formater le schéma Prisma.
RUN npx prisma format

# Pousser les migrations Prisma.
RUN npx prisma db push

# Construire l'application.
RUN npm run build

# Exposer le port.
EXPOSE 3000

# Commande par défaut pour lancer l'application.
CMD ["npm", "start"]
