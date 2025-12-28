const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mixfy API rodando 🚀");
});

app.post("/generate", (req, res) => {
  const { style, mood, tempo, duration } = req.body;

  res.json({
    status: "success",
    track: {
      id: "mixfy_001",
      name: "Coração em Ruínas",
      style,
      mood,
      tempo,
      duration,
      audioUrl: "/audios/demo.mp3",
      createdAt: new Date()
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});





