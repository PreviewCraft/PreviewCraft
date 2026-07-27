FROM node:22-slim AS base

WORKDIR /app

COPY package*.json /

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=base /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx","-g","daemon off;"]