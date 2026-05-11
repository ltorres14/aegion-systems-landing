const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;
const publicDir = path.join(__dirname, "public");
const siteConfigPath = path.join(__dirname, "data", "site.json");

app.use(express.static(publicDir));

app.get("/api/site", async (_req, res) => {
  try {
    const siteConfig = await fs.readFile(siteConfigPath, "utf8");
    res.type("application/json").send(siteConfig);
  } catch (error) {
    res.status(500).json({ error: "No se pudo cargar la configuración del sitio." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Aegion Systems landing disponible en http://localhost:${PORT}`);
});
