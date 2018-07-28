FROM mhart/alpine-node:10
LABEL maintainer="jlelse (https://about.jlelse.de)"
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
