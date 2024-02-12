FROM node:18

WORKDIR /client
COPY . /client  
COPY package.json ./
COPY package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . . 
EXPOSE 3000
CMD [ "npm","start" ]




# FROM node:latest
# WORKDIR /server
# COPY . /server

# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install
# EXPOSE 4000
# CMD [ "node","server.js" ]
