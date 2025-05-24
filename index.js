const mysql = require("mysql2");
const express = require("express");
const app = express();

// Configuração básica do Express
app.use(express.json());

// Configuração do banco de dados
const config = {
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

let connection;

function connectWithRetry() {
  connection = mysql.createConnection(config);

  connection.connect((error) => {
    if (error) {
      console.error("Erro ao conectar ao MySQL:", error.message);
      console.log("Tentando reconectar em 5 segundos...");
      setTimeout(connectWithRetry, 5000); // tenta de novo em 5 segundos
    } else {
      console.log("Conectado ao MySQL com sucesso!");
    }
  });
}

connectWithRetry();

app.get("/", (req, res) => {
  res.send("<h1>Hello from Docker!</h1>");
});

// Rota de health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// Fechar conexão ao encerrar o aplicativo
process.on("SIGINT", () => {
  connection.end();
  process.exit();
});
