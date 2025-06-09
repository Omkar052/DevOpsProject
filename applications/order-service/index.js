const express = require('express');
const { Pool } = require('pg');
const prom = require('prom-client'); // <-- Add prom-client
const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Prometheus metrics setup
const register = new prom.Registry();

const ordersCreated = new prom.Counter({
  name: 'orders_created_total',
  help: 'Total number of orders created',
  labelNames: ['status'],
  registers: [register],
});

const orderTotalAmount = new prom.Gauge({
  name: 'order_total_amount',
  help: 'Total amount of orders',
  registers: [register],
});

const orderProductQuantity = new prom.Counter({
  name: 'order_product_quantity',
  help: 'Quantity of products ordered',
  labelNames: ['product_name'],
  registers: [register],
});

app.post('/orders', async (req, res) => {
  const { user_id, products, total } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO orders (user_id, products, total, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, JSON.stringify(products), total, 'pending']
    );
    ordersCreated.labels('pending').inc();
    orderTotalAmount.set(total);
    products.forEach(p => orderProductQuantity.labels(p.name).inc(p.quantity));
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/orders/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add /metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(port, async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        products JSONB NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(`Order service running on port ${port}`);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
});