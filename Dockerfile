FROM node:20

WORKDIR /app/backend

COPY . .

RUN ["npm", "install"]

# backend
EXPOSE 3000

CMD ["npm", "start"]