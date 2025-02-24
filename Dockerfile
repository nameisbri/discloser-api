FROM node:18-alpine

RUN apk update && apk add graphicsmagick

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]