FROM node:alpine as build

WORKDIR /app

RUN npm i -g serve

COPY package*.json ./
COPY yarn.lock ./
RUN npm install

COPY ./ ./

RUN mkdir -p /app/node_modules/.cache && chmod -R 777 /app/node_modules/.cache
RUN mkdir -p /app/node_modules/.cache/.eslintcache && chmod -R 777 /app/node_modules/.cache/.eslintcache

RUN npm run build

#USER node

EXPOSE 3000

#CMD ["yarn", "dev", "--port", "3000", "--host", "0.0.0.0"]
# CMD ["yarn", "dev"]
#CMD ["yarn", "preview", "--port", "3000", "--host", "0.0.0.0", "--https", "true"]
CMD ["npx", "serve", "-s", "dist"]

#FROM nginx:1.23-alpine as runtime
#
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#
#WORKDIR /usr/share/nginx/html
#
#RUN rm -rf ./*
#
#COPY --from=build /app/dist .
#
#EXPOSE 3000
#
#CMD ["nginx", "-g", "daemon off;"]