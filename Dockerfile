FROM node:8.11

USER root
RUN apt-get update
RUN apt-get install -y vim
RUN npm i -g npm@6.1.0

WORKDIR /prebuilt
COPY package.json .
RUN npm install --silent

WORKDIR /studio-frontend
ENTRYPOINT cp -r /prebuilt/node_modules /studio-frontend/ && \
    npm install && \
    npm run start

EXPOSE 18011
