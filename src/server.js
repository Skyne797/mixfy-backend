import express from "express";
import generateRoutes from "./routes/generate.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Servir arquivos públicos (áudios)
app.use("/public", express.static("public"));

// Rotas principais
app.use("/generate", generateRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.send("Mixfy backend online");
});

// Porta (Render usa process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
