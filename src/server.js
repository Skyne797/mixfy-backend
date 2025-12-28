import dotenv from "dotenv";
dotenv.config();

import express from "express";
import generateRoutes from "./routes/generate.routes.js";



const app = express();

app.use(express.json());

// rotas
app.use(generateRoutes);

// ⚠️ AQUI está a correção principal
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Mixfy backend rodando na porta ${PORT}`);
});
