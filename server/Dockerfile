### Build the server ###
FROM node:alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

### Run the server ###
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
RUN npm install
RUN npm install -g pm2

COPY --from=0 /app/dist ./

CMD ["pm2-runtime", "index.js"]
