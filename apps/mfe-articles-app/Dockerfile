FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk update && apk add --update --no-cache build-base python3 make gcc

COPY package*.json ./

ARG NPM_TOKEN
COPY .npmrc .npmrc
RUN npm ci --loglevel verbose
COPY . .

ARG COMMIT_HASH
RUN sed -e s/__COMMIT_HASH__/$COMMIT_HASH/g -i src/pages/api/healthcheck/mfe-articles/index.js

ENV NODE_ENV production
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
