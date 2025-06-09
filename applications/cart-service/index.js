const express = require('express');
const Redis = require('ioredis');
const app = express();
const port = process.env.PORT || 3004;

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);

app.post('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  const { product_id, quantity } = req.body;
  try {
    await redis.hset(`cart:${userId}`, product_id, quantity);
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await redis.hgetall(`cart:${userId}`);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/cart/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  try {
    await redis.hdel(`cart:${userId}`, productId);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Cart service running on port ${port}`);
});