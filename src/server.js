import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors"; // ✅ IMPORTANTE
import generateRoutes from "./routes/generate.routes.js";

const app = express();

// ✅ CORS LIBERADO (ESSENCIAL PARA O LOVABLE)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// rotas
app.use(generateRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔥 Mixfy backend rodando na porta ${PORT}`);
});
