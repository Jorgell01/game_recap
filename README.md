# 🎮 Game Recap

**Game Recap** es una aplicación web que te permite registrar, visualizar y analizar tus sesiones de juego de forma sencilla y visual. Ofrece estadísticas personalizadas, autenticación con correo o Steam, y una interfaz intuitiva que se adapta a modo claro y oscuro.

---

## 🚀 ¿Qué hace esta aplicación?

- Permite a los usuarios iniciar sesión con correo o su cuenta de Steam.
- Guarda sesiones de juego (nombre del juego, duración, fecha).
- Muestra un historial detallado de tus partidas jugadas.
- Genera estadísticas automáticas: tiempo total jugado, promedio por sesión, juego más jugado.
- Visualiza tus datos con gráficas de barras y gráficos circulares.
- Ofrece una experiencia personalizada con cambio de tema (claro/oscuro).

---

## 🛠️ Tecnologías utilizadas

### 🔹 Frontend

- React + Vite
- React Router DOM
- Recharts (gráficas)
- Lucide-react (iconos)
- Context API (para tema claro/oscuro)
- CSS clásico + variables

### 🔸 Backend

- Node.js + Express
- Prisma ORM (con SQLite por defecto)
- Passport.js (JWT y Steam OpenID)
- JWT para autenticación segura
- dotenv para variables de entorno

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
npx prisma generate
npx prisma migrate dev --name init
```

🔑 Crea un archivo `.env` con:

```
PORT=3000
JWT_SECRET=una_clave_secreta
STEAM_API_KEY=tu_clave_steam
BASE_URL=http://localhost:3000
```

Ejecuta el backend:

```bash
npm run dev
```

### 3. Configura el frontend

```bash
cd ../frontend
npm install
npm run dev
```

La app se ejecutará en: `http://localhost:5173`

---

## 📦 Estructura del proyecto

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
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

---

## 🧾 Dependencias clave

### Backend

- express
- cors
- jsonwebtoken
- prisma / @prisma/client
- passport / passport-jwt / passport-steam
- dotenv

### Frontend

- react / react-dom / react-router-dom
- recharts
- lucide-react

---

## 👨‍💻 Autor

- Jorge A. Herrero Santana  
- GitHub: [@Jorgel01](https://github.com/Jorgel01)

---

¡Gracias por probar Game Recap! Si te gusta, no dudes en dejar una estrella ⭐ en el repo.