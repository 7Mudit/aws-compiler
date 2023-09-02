const express = require("express");
const  compileCode  = require("./CompileCode");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Running properly");
  res.json({
    message: "Its working",
  });
});

app.post("/compile", async (req, res) => {
  const { code, language } = req.body;
  try {
    const output = await compileCode(code, language);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8080, () => {
  console.log("App is running on 8080");
});
