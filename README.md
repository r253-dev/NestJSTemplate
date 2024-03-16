# NestJS Template Project

## Installation

```bash
git clone https://github.com/r253-dev/NestJSTemplate.git
cd NestJSTemplate
$ npm ci
```

## Running the app

```bash
# docker
$ docker compose up -d --build

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# docker
$ docker compose exec api npm run test

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Seed

```bash
# docker
$ docker compose exec api npm run build
$ docker compose exec api npm run db:seed
```

## Website

- develop branch: [https://dev.nest.r253.dev](https://dev.nest.r253.dev)
- production branch: [https://nest.r253.dev](https://nest.r253.dev)
