#node
FROM node:21

WORKDIR /usr/src/app

RUN npm install -g  serve

COPY . .

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]