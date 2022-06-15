FROM node:alpine

WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN ./node_modules/typescript/bin/tsc

CMD [ "node",  "dist/index.js" ]