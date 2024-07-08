# Utiliser l'image officielle de Node.js.
FROM node:20

# Définir le répertoire de travail.
WORKDIR /app/backend

# Copier tout le code source dans le conteneur.
COPY . .

# Installer les dépendances.
RUN npm install

# Installer Prisma CLI globalement.
RUN npm install prisma --save-dev

# Définir les variables d'environnement nécessaires pour Prisma.
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/nestjs-final-test-db?schema=public"

# Générer le client Prisma.
RUN npx prisma generate

# Formater le schéma Prisma.
RUN npx prisma format

# Pousser les migrations Prisma.
RUN npx prisma db push

# Exposer le port pour l'application backend.
EXPOSE 3000

# Commande par défaut pour lancer l'application.
CMD ["npm", "start"]
