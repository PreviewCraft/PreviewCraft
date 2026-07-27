FROM node:22-slim

WORKDIR /app

COPY package*.json /

RUN npm install

COPY . .

EXPOSE 5000 
# will adjust the port accordingly in the future

CMD ["npm","start"]