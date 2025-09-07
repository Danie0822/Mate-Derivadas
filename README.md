# Mate-Derivadas

API para aprender y practicar derivadas matemáticas, con generación de respuestas automáticas usando IA open source local (Ollama + Mistral).

## Descripción
Este proyecto es una API RESTful para gestionar usuarios, ejercicios, guías de estudio y preguntas/respuestas de derivadas. Incluye integración con una IA local (modelo Mistral vía Ollama) para responder preguntas matemáticas de forma gratuita y sin límites.

## Requisitos
- Docker y Docker Compose
- Node.js 18+

## Instalación y uso rápido

1. **Clona el repositorio y entra a la carpeta:**
   ```sh
   git clone <repo-url>
   cd Mate-Derivadas
   ```

2. **Copia el archivo de variables de entorno:**
   ```sh
   cp .env.example .env
   # Edita .env si lo necesitas
   ```

3. **Instala dependencias Node.js:**
   ```sh
   npm install
   ```


4. **Levanta la base de datos y Ollama (IA) con Docker:**
   ```sh
   docker compose -f docker-compose.yml up -d
   docker compose -f docker-compose.ollama.yml up -d
   ```
   Esto inicia la base de datos y Ollama.

   **IMPORTANTE:** La primera vez, debes descargar el modelo ejecutando:
   ```sh
   docker exec -it ollama ollama run mistral
   ```
   Solo es necesario la primera vez, luego Ollama lo usará automáticamente.

5. **Ejecuta las migraciones de la base de datos:**
   ```sh
   npx sequelize-cli db:migrate
   ```

6. **Inicia el servidor Node.js:**
   ```sh
   npm start
   ```

7. **Accede a la documentación Swagger:**
   - [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Endpoints principales
- `/api/ai-questions/ask` — Haz preguntas de derivadas a la IA
- `/api/users`, `/api/exercises`, `/api/study-guides`, etc.

## Notas
- La primera respuesta de la IA puede tardar (descarga y carga del modelo), luego será más rápida.
- Todo corre localmente, sin costos ni límites de uso.

---

**Autor:** Danie0822
