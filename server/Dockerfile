### Build the server ###
FROM node:alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
RUN npm install

COPY src ./src
RUN npm run build

### Run the server ###
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev
RUN npm install -g pm2

COPY --from=0 /app/dist ./

CMD ["pm2-runtime", "index.js"]
