FROM node:16

USER root
RUN apt-get update
RUN apt-get install -y vim
RUN npm i -g npm@8.x.x

WORKDIR /prebuilt
COPY config/ config/
COPY src/ src/
COPY package.json .
COPY package-lock.json .
RUN npm install

WORKDIR /studio-frontend
ENTRYPOINT cp -r /prebuilt/node_modules /studio-frontend/ && \
    npm install && \
    npm run start

EXPOSE 18011
