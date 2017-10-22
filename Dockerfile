FROM node

RUN npm i -g forever
RUN mkdir -p /logs/pager-org-api
RUN mkdir -p /app

COPY package.json /app
RUN cd /app; npm i --production

COPY dist /app
EXPOSE 8001

ENTRYPOINT forever -l /logs/pager-org-api/log.txt -a /app/lib/index.js
