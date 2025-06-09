import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`)
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const addToCart = async (productId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/cart/1`, { product_id: productId, quantity: 1 });
      setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">E-Commerce Platform</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h2 className="text-xl">{product.name}</h2>
            <p>${product.price}</p>
            <button
              onClick={() => addToCart(product.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;