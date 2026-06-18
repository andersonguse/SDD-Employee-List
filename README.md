# SDD Employee List

Spec Driven Development demo application for managing employees with a Spring
Boot backend, React TypeScript frontend, and Dockerized PostgreSQL database.

## Local Demo

```powershell
docker compose up -d postgres
cd backend
mvn spring-boot:run
```

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend URL printed by Vite, usually `http://localhost:5173`.

## Validation

```powershell
cd backend
mvn test
```

```powershell
cd frontend
npm test
npm run build
```
