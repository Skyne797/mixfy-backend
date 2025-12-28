import express from "express";

const router = express.Router();

// POST /generate
router.post("/generate", (req, res) => {
  const { prompt, style, duration } = req.body;

  return res.json({
    status: "ok",
    message: "Mixfy recebeu o pedido com sucesso",
    received: {
      prompt,
      style,
      duration
    }
  });
});

export default router;


