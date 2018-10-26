#
# STAGE 1
# - Install and build necessary dependencies
#
FROM node:10-alpine as build
COPY . /app
WORKDIR /app
RUN apk add --no-cache sqlite-libs sqlite-dev python build-base openjdk8
RUN npm i && npm i --prefix admin
RUN npm run build
RUN npm test
RUN rm -rf .gradle build src tests

#
# STAGE 2
# - Keep Only runtime libraries: no build tool is allowed in production.
#
FROM node:10-alpine
LABEL maintainer="Jan-Lukas Else (https://about.jlelse.de)"

# Copy just needed directories
COPY --from=build /app/admin/dist /app/admin/dist
COPY --from=build /app/app /app/app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/package-lock.json /app/package-lock.json

WORKDIR /app
RUN apk add --no-cache sqlite-libs && mkdir /app/data

EXPOSE 8080
CMD ["npm", "start"]
