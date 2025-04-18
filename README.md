# 🎮 Game Recap

**Game Recap** es una aplicación web que te permite registrar, visualizar y analizar tus sesiones de juego. Soporta autenticación tradicional y por Steam, y ofrece estadísticas detalladas sobre tus hábitos de juego, todo con una interfaz moderna y ligera.

## ✨ Funcionalidades

- 🔐 Autenticación por email y contraseña
- 🎮 Login con cuenta de Steam (vía OpenID)
- 📋 Historial de sesiones de juego
- 📊 Estadísticas personales:
  - ⏱️ Tiempo total jugado
  - 🕒 Media de tiempo por sesión
  - 🥇 Juego más jugado
- 🔐 Protección de rutas con JWT
- 🔄 Sincronización frontend ↔ backend
- 🌙 Selector de tema claro/oscuro
- 📂 Gestión de usuarios y sesiones

---

## 🛠️ Tecnologías utilizadas

### ⚛️ Frontend

- React + Vite
- React Router DOM
- Recharts (gráficos estadísticos)
- CSS clásico (con variables y temas)
- LocalStorage (persistencia de sesión y tema)
- Context API (gestión de tema global)

### 🌐 Backend

- Node.js + Express
- Prisma ORM + SQLite
- Passport (estrategias JWT y Steam OpenID)
- dotenv para configuración sensible

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/Jorgell01/game_recap.git
cd game_recap
```

### 2. Inicia el backend

```bash
cd backend
npm install
npm run dev
```

### 3. Inicia el frontend

```bash
cd ../frontend
npm install
npm run dev
```

📍 Abre `http://localhost:5173` en tu navegador.  
La API estará corriendo en `http://localhost:3000`.

---

## ⚙️ Variables de entorno

Crea un archivo `.env` dentro de la carpeta `backend/`:

```env
PORT=3000
JWT_SECRET=tu_clave_secreta
STEAM_API_KEY=tu_clave_steam
BASE_URL=http://localhost:3000
```

---

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
│       ├── context/
│       ├── pages/
│       ├── styles/
│       └── App.jsx
└── README.md
```

---

## ✍️ Autor

- Jorge A. Herrero Santana  
- GitHub: [@Jorgell01](https://github.com/Jorgell01)

---

¡Gracias por usar **Game Recap**!  
¿Ideas, sugerencias o mejoras? ¡No dudes en contribuir! 🚀