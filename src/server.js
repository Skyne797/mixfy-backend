import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import generateRoutes from "./routes/generate.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Pasta pública para áudios
app.use("/public", express.static("public"));

// 🔹 Rotas principais
app.use("/generate", generateRoutes);

// Porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Mixfy backend rodando na porta ${PORT}`);
});
