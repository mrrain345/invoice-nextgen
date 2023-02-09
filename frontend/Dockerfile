### Build the frontend ###
FROM node:alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

### Run the frontend ###
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev
RUN npm install -g serve

COPY --from=0 /app/dist ./

CMD ["serve", "-s", "-p", "8080"]