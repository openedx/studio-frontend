FROM node:6.11

USER root
RUN apt-get update

WORKDIR /edx/prebuilt/studio-frontend
COPY package.json ./
RUN npm install --silent

WORKDIR /edx/src/studio-frontend
ENTRYPOINT cp -r /edx/prebuilt/studio-frontend/node_modules /edx/src/studio-frontend && \
    npm install && \
    npm run start

EXPOSE 18123
