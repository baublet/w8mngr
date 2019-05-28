FROM node:latest

WORKDIR /app/

ENV NODE_ENV development

COPY package.json ./
RUN npm install

CMD [ "npm", "start:lambda" ]
