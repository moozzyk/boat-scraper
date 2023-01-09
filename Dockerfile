FROM node:16
RUN apt-get update
RUN apt-get install chromium -y
ENV HOME=/home/app-user
RUN useradd -m -d $HOME -s /bin/bash app-user 
RUN mkdir -p $HOME/app 
WORKDIR $HOME/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY . .
RUN ls -al $HOME
RUN chown -R app-user:app-user $HOME
RUN ls -al $HOME
USER app-user
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
RUN whoami
RUN ls -al $HOME/*
RUN pwd
RUN npm install
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/index.js" ]

