# 🎮 Game Recap

**Game Recap** es una aplicación para registrar, visualizar y analizar tus sesiones de juego. Permite autenticación por correo y autenticación con Steam. Muestra estadísticas como el tiempo total jugado, media por sesión, y el juego más jugado. Además, facilita la gestión de tus sesiones de juego y proporciona una experiencia personalizada para los jugadores.

## ✨ Funcionalidades

- 🔐 Login tradicional con email/contraseña
- 🎮 Login con cuenta de Steam (OpenID)
- 🧾 Historial de partidas jugadas
- 📊 Estadísticas personales de juego
  - Tiempo total jugado
  - Media de tiempo por sesión
  - Juego más jugado
- 🔐 Protección de rutas con JWT
- 🌐 Redirección desde Steam al frontend con token JWT
- 🔄 Sincronización de datos entre frontend y backend
- 📂 Gestión de usuarios y sesiones

## 🛠️ Tecnologías utilizadas

### Frontend
- React + Vite
- Hooks (useState, useEffect)
- Estilos CSS simples
- LocalStorage para guardar sesión

### Backend
- Node.js + Express
- Prisma ORM + SQLite
- Passport (JWT + Steam OpenID)
- Dotenv para variables de entorno

## 🧪 Cómo usar

```bash
# Clona el repositorio
git clone https://github.com/Jorgel01/game_recap.git
cd game_recap
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd ../frontend
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173` y el backend en `http://localhost:3000`.

## 🧾 Variables de entorno

### `.env` del backend:

```
PORT=3000
JWT_SECRET=tu_clave_secreta
STEAM_API_KEY=tu_clave_steam
BASE_URL=http://localhost:3000
```

## 📂 Estructura del proyecto

```
game_recap/
├── backend/
│   ├── controllers/
│   ├── passport/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── .env
│   └── index.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       └── App.jsx
└── README.md
```

## ✍️ Autor

- Jorge A. Herrero Santana  
- GitHub: [@Jorgell01](https://github.com/Jorgell01)

---

¡Gracias por probar Game Recap!
