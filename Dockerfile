# Utiliser l'image officielle de Node.js.
FROM node:20

# Définir le répertoire de travail.
WORKDIR /app/backend

# Copier tout le code source dans le conteneur.
COPY . .

# Installer les dépendances.
RUN npm install

# Exposer le port pour l'application backend.
EXPOSE 3000

# Commande par défaut pour lancer l'application.
CMD ["npm", "start"]
