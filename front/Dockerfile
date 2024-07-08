# Étape 1 : Construction de l'application
FROM node:16 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du projet dans le conteneur
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers de construction de l'étape précédente dans le répertoire Nginx par défaut
COPY --from=build /app/build /usr/share/nginx/html

# Copier le fichier de configuration Nginx personnalisé si nécessaire
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80 pour le serveur Nginx
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
