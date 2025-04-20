
# 🎮 Game Recap

**Game Recap** es una aplicación web que te permite registrar, visualizar y analizar tus sesiones de juego de forma sencilla y visual. Ofrece estadísticas personalizadas, autenticación con correo o Steam, una experiencia con modo claro/oscuro y una comunidad interactiva con reseñas y favoritos.

---

## 🚀 ¿Qué hace esta aplicación?

- ✅ **Login con correo o cuenta de Steam**
- ✅ Guarda tus sesiones de juego (nombre, duración, fecha).
- ✅ Visualiza un historial detallado con portadas de los juegos.
- ✅ Consulta estadísticas personalizadas: total jugado, promedio, más jugado.
- ✅ Cambia entre **modo claro y oscuro** con un solo clic.
- ✅ Visualiza tus datos con **gráficos interactivos**.
- ✅ Explora videojuegos desde la **RAWG API** con buscador, géneros y etiquetas.
- ✅ Haz clic en cualquier juego del historial o explorador para ver su **Game Detail** con:
  - Portada en alta calidad
  - Géneros, plataformas, modos de juego
  - Valoración media y Metacritic
- ✅ Guarda juegos en tu lista de **Favoritos**
- ✅ Publica, visualiza y elimina tus **reseñas de usuario**
- ✅ Diseño **responsive** y animaciones sutiles para una experiencia moderna

---

## 🧪 ¿Cómo usar el proyecto?

### 1. Clona el repositorio

```bash
git clone https://github.com/Jorgel01/game_recap.git
cd game_recap
```

### 2. Configura el backend

```bash
cd backend
npm install
```

🔑 Crea un archivo `.env`:

```env
PORT=3000
JWT_SECRET=una_clave_secreta
STEAM_API_KEY=tu_clave_steam
BASE_URL=http:./dev.db
RAWG_API_KEY=tu_clave_rawg_api
```

Ejecuta:

```bash
npm run dev
```

### 3. Configura el frontend

```bash
cd ../frontend
npm install
```

🔑 Crea un `.env`:

```env
VITE_BASE_URL=http://127.0.0.1:3000
VITE_RAWG_API_KEY=tu_clave_rawg_api
```

Ejecuta:

```bash
npm run dev
```

La app estará en: `http://localhost:5173`

---

## 🧩 Funcionalidades nuevas

| Módulo         | Descripción |
|----------------|-------------|
| **Game Detail** | Vista detallada de juegos con portada, géneros, plataformas, modos, Metacritic y más |
| **Reseñas de usuarios** | Crear, visualizar y eliminar reseñas por juego |
| **Favoritos** | Añadir y eliminar juegos favoritos (❤️🤍), con persistencia en base de datos |
| **Community Hub** | Explora juegos de RAWG filtrando por búsqueda, género y etiqueta |
| **Modo oscuro/claro** | Tema global personalizable con CSS Variables y animación suave |

---

## 🛠️ Tecnologías utilizadas

### 🔹 Frontend

- React + Vite
- React Router DOM
- Recharts
- Lucide-react
- Context API (modo oscuro/claro)
- CSS clásico modular con variables

### 🔸 Backend

- Node.js + Express
- Prisma ORM (SQLite por defecto)
- JWT y Passport (con Steam OpenID)
- dotenv

---

## 📦 Estructura del proyecto

```
game_recap/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── passport/
│   ├── prisma/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
├── .env (ambos)
└── README.md
```

---

## 📊 Ejemplos visuales

- 📷 Historial de partidas con portadas
- ⭐ Lista de favoritos personalizable
- ✍️ Publicación de reseñas estilo comunidad Steam
- 🕵️ Game Detail enriquecido al hacer clic en cualquier juego

---

## 👨‍💻 Autor

- Jorge A. Herrero Santana  
- GitHub: [@Jorgell01](https://github.com/Jorgell01)

---

¿Te gusta el proyecto? ¡Déjame una ⭐ en GitHub!  
¿Tienes ideas o bugs? Abre una issue o haz un PR 💡
