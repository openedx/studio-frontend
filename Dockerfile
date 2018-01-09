FROM node:8.9.3

USER root
RUN apt-get update

WORKDIR /prebuilt
COPY package.json .
RUN npm install --silent

WORKDIR /studio-frontend
ENTRYPOINT cp -r /prebuilt/node_modules /studio-frontend/ && \
    npm install && \
    npm run start

EXPOSE 18011
