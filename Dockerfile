# base image
FROM node:20.11.1-bullseye as base
RUN apt-get update && apt-get install -y tini
USER node
WORKDIR /app

# build image
FROM base as build
COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build
RUN npm ci --omit=dev

# production image
FROM base as production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/entrypoint.sh ./

EXPOSE $PORT

ENTRYPOINT ["tini", "--", "./entrypoint.sh"]
