const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/products', async (req, res) => {
  const { name, price, category } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *',
      [name, price, category]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100)
      )
    `);
    console.log(`Product service running on port ${port}`);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
});