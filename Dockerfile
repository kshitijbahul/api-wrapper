FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY babel.config.js babel.config.js
RUN npm install

COPY ./src ./src

RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]