# Invoice NextGen

Invoice NextGen is an easy to use invoice manager for small businesses.
It allows you to create, edit, search and print invoices.

Only supported language is **Polish**.

## Technology stack

### Frontend

- TypeScript
- React
- React-Router
- SCSS

### Backend

- TypeScript
- Express
- MongoDB (Mongoose)
- Runtypes
- JWT

## Production setup

### Installation and starting:

```bash
docker-compose up --build -d
```

### Stopping:

```bash
docker-compose down
```

## Development setup

### Installation:

```bash
cd frontend
npm install
cd ..

cd server
npm install
cd ..

docker-compose -f docker-compose.dev.yml build
```

### Starting:

```bash
docker-compose -f docker-compose.dev.yml up --build -d
```

### Stopping:

```bash
docker-compose -f docker-compose.dev.yml down
```

