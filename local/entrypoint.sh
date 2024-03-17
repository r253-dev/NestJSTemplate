#!/bin/sh
set -eu

npm run build
npm run db:migrate
npm run start:dev
