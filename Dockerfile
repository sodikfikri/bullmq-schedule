FROM node:18-alpine as base

WORKDIR /var/www/html/services/bull_schedule

COPY ./ /var/www/html/services/bull_schedule
# COPY ./Dockerfile /var/www/html/services/merchant
# COPY ./package.json /var/www/html/services/abs
# COPY ./package-lock.json /var/www/html/services/abs
# COPY ./.env /var/www/html/services/abs

# ENV NODE_ENV=${NODE_ENV}

# RUN apk add --no-cache chromium --repository=http://dl-cdn.alpinelinux.org/alpine/v3.10/main


RUN npm install

# RUN npm uninstall bcrypt
# RUN npm install bcrypt
# RUN npm cache clean --force && rm -rf node_modules && npm install
# RUN npm i -g bcrypt

RUN npm i -g nodemon