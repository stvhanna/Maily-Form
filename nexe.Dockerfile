FROM node:10.14.0-alpine as build

# Needed for Nexe
ARG GITHUB_TOKEN=""

COPY . /app
WORKDIR /app
RUN apk add --no-cache python build-base openjdk8
RUN npm i && npm i --prefix admin
RUN npm run build
RUN npm run package

FROM alpine
LABEL maintainer="Jan-Lukas Else (https://about.jlelse.de)"

COPY --from=build /app/maily-form /bin/maily-form

WORKDIR /app
RUN mkdir /app/data

EXPOSE 8080
CMD ["maily-form"]
