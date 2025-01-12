const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get("/itens", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM produtos");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar itens" });
    }
});

app.post("/item", async (req, res) => {
    const { nome, preco, descricao } = req.body;
    try {
        await pool.query(
            "INSERT INTO produtos (nome, preco, descricao) VALUES ($1, $2, $3)",
            [nome, preco, descricao]
        );
        res.status(201).json({ message: "Produto adicionado com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao adicionar item" });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});
