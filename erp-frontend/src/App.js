import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', quantity: 0, price: 0 });

  // Cargar productos al montar el componente
  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error('Error al obtener productos:', error));
  }, []);

  // Manejo de cambio en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Función para agregar producto
  const addProduct = () => {
    axios.post('http://localhost:3000/products', newProduct)
      .then(response => {
        setProducts([...products, response.data]);
        setNewProduct({ name: '', description: '', quantity: 0, price: 0 });
      })
      .catch(error => console.error('Error creando producto:', error));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ERP MVP - Gestión de Productos</h1>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newProduct.name}
          onChange={handleChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={handleChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={newProduct.quantity}
          onChange={handleChange}
          style={{ marginRight: '0.5rem', width: '80px' }}
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={newProduct.price}
          onChange={handleChange}
          style={{ marginRight: '0.5rem', width: '80px' }}
        />
        <button onClick={addProduct}>Agregar Producto</button>
      </div>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong>: {product.description} | Cantidad: {product.quantity} | Precio: ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
