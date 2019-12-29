FROM node:alpine

WORKDIR /usr/src/authentiq
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 2000
CMD ["npm", "start"]