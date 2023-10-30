const express = require("express");
const compileCode = require("./CompileCode");
const app = express();
const cors = require('cors')

app.use(express.json());

app.use(cors({
  origin : true , 
  credentials : true
}));

app.get("/", (req, res) => {
  console.log("Running properly");
  res.json({
    message: "Its working",
  });
});

app.post("/compile", async (req, res) => {
  const { code, language, input } = req.body;
  console.log(code , language , input);
  try {
    const output = await compileCode(code, language, input);  // Pass 'input' here
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message, type: error.type });
  }
});

app.listen(8080, () => {
  console.log("App is running on 8080");
});
