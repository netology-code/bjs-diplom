FROM node:10-alpine
WORKDIR /usr/src
COPY ./package*.json ./
RUN npm install --only=production
COPY . .
CMD [ "node", "./app.js" ]
EXPOSE 1337
