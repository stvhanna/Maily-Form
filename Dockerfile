#
# STAGE 1
# - Install and build necessary dependencies
#
FROM node:10-alpine as build
COPY . /app
WORKDIR /app
RUN apk add --update sqlite-libs sqlite-dev python build-base openjdk8 && rm -rf /var/cache/apk/*
RUN npm install
RUN npm run build
RUN npm test
RUN rm -rf .gradle build src tests

#
# STAGE 2
# - Keep Only runtime libraries: no build tool is allowed in production.
#
FROM node:10-alpine
LABEL maintainer="Jan-Lukas Else (https://about.jlelse.de)"

COPY --from=build /app /app
WORKDIR /app
RUN apk add --update sqlite-libs && rm -rf /var/cache/apk/*

EXPOSE 8080
CMD ["npm", "start"]
