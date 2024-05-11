FROM node:18 as builder

WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install --production

COPY . .

EXPOSE 3000

CMD ["bash", "-c", "yarn db:generate && yarn db:migrate && yarn start"]
