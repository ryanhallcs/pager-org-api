FROM node

RUN npm i -g forever
RUN mkdir -p /logs/pager-org-api
RUN mkdir -p /app

COPY package.json /app
COPY .sequelizerc /app
COPY gulpfile.js /app
RUN cd /app; npm i

COPY dist /app/dist
EXPOSE 8001
RUN npm i -g gulp
# ENTRYPOINT cd /app; gulp migrate; 
WORKDIR /app
ENTRYPOINT gulp migrateProd; forever -l /logs/pager-org-api/log.txt -a /app/dist/lib/index.js
