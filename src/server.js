import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import generateRoutes from "./routes/generate.routes.js";

const app = express();

// ✅ CORS LIBERADO (resolve Failed to fetch no Lovable)
app.use(cors());

// ✅ Permite JSON no body
app.use(express.json());

// ✅ Rota principal
app.use("/generate", generateRoutes);

// ✅ Porta padrão Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Mixfy backend rodando na porta ${PORT}`);
});
