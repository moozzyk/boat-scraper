FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/index.js" ]
