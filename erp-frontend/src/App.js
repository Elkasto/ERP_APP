import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Estado que almacena productos existentes
  const [products, setProducts] = useState([]);
  // Estado que guarda los valores del nuevo producto a crear
  const [newProduct, setNewProduct] = useState({ name: '', description: '', quantity: 0, price: 0 });
  // Estado que guarda errores de validación
  const [errors, setErrors] = useState({});
  // Estado para edición de productos
  const [editProductId, setEditProductId] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', description: '', quantity: 0, price: 0 });

  // Cargar productos al montar el componente
  // Se llama cuando se renderiza por primera vez el componente
  useEffect(() => {
    axios.get('/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error al obtener productos:', error));
  }, []);

  // Manejo de cambio en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Validación de campos
  const validateInputs = () => {
    const newErrors = {};
    if (!newProduct.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!newProduct.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (newProduct.quantity <= 0) newErrors.quantity = 'Cantidad debe ser mayor a cero';
    if (newProduct.price <= 0) newErrors.price = 'Precio debe ser mayor a cero';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para agregar producto
  const addProduct = () => {
    // Si hay errores, no se envía
    if (!validateInputs()) return;

    // Si pasa las validaciones, enviamos
    axios.post('/products', newProduct)
      .then(res => {
        setProducts([...products, res.data]);
        setNewProduct({ name: '', description: '', quantity: 0, price: 0 });
        setErrors({});
      })
      .catch(error => console.error('⛔ Error creando producto:', error));
  };
  // 🗑️ Función para eliminar producto
  const deleteProduct = (id) => {
    axios.delete(`/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(err => console.error('⛔ Error al eliminar producto:', err));
  };
  const updateProduct = (id) => {
    axios.put(`/products/${id}`, editValues)
      .then(res => {
        setProducts(products.map(p => (p.id === id ? res.data : p)));
        setEditProductId(null);
        setEditValues({ name: '', description: '', quantity: 0, price: 0 });
      })
      .catch(err => console.error('⛔ Error al editar producto:', err));
  };


  return (
    <div style={{ padding: '2rem' }}>
      <h1>ERP MVP - Gestión de Productos</h1>
      <div style={{ marginBottom: '1.5rem' }}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={newProduct.name}
            onChange={handleChange}
            style={{ marginRight: '0.5rem' }}
          />
          {errors.name && <small style={{ color: 'red' }}>{errors.name}</small>}
        </div>
        <div>
          <input
            type="text"
            name="description"
            placeholder="Descripción"
            value={newProduct.description}
            onChange={handleChange}
            style={{ marginRight: '0.5rem' }}
          />
          {errors.description && <small style={{ color: 'red' }}>{errors.description}</small>}
        </div>
        <div>
          <input
            type="number"
            name="quantity"
            placeholder="Cantidad"
            value={newProduct.quantity}
            onChange={handleChange}
            style={{ marginRight: '0.5rem', width: '80px' }}
          />
          {errors.quantity && <small style={{ color: 'red' }}>{errors.quantity}</small>}
        </div>
        <div>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={newProduct.price}
            onChange={handleChange}
            style={{ marginRight: '0.5rem', width: '80px' }}
          />
          {errors.price && <small style={{ color: 'red' }}>{errors.price}</small>}
        </div>
        <button
          onClick={addProduct}
          disabled={
            !newProduct.name.trim() ||
            !newProduct.description.trim() ||
            newProduct.quantity <= 0 ||
            newProduct.price <= 0
          }
        >Agregar Producto
        </button>
      </div>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {editProductId === product.id ? (
              <>
                <input
                  type="text"
                  value={editValues.name}
                  onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                  placeholder="Nombre"
                />
                <input
                  type="text"
                  value={editValues.description}
                  onChange={e => setEditValues({ ...editValues, description: e.target.value })}
                  placeholder="Descripción"
                />
                <input
                  type="number"
                  value={editValues.quantity}
                  onChange={e => setEditValues({ ...editValues, quantity: parseInt(e.target.value) })}
                  style={{ width: '80px' }}
                  placeholder="Cantidad"
                />
                <input
                  type="number"
                  value={editValues.price}
                  onChange={e => setEditValues({ ...editValues, price: parseFloat(e.target.value) })}
                  style={{ width: '80px' }}
                  placeholder="Precio"
                />
                <button onClick={() => updateProduct(product.id)}>💾 Guardar</button>
                <button
                  style={{ marginLeft: '0.5rem', background: 'gray', color: 'white', border: 'none', cursor: 'pointer' }}
                  onClick={() => setEditProductId(null)}
                >
                  ❌ Cancelar
                </button>
              </>
            ) : (
              <>
                <strong>{product.name}</strong>: {product.description} | Cantidad: {product.quantity} | Precio: ${product.price}
                <button
                  style={{ marginLeft: '1rem', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
                  onClick={() => {
                    setEditProductId(product.id);
                    setEditValues({
                      name: product.name,
                      description: product.description,
                      quantity: product.quantity,
                      price: product.price,
                    });
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  style={{ marginLeft: '0.5rem', color: 'white', background: 'crimson', border: 'none', cursor: 'pointer' }}
                  onClick={() => deleteProduct(product.id)}
                >
                  🗑️ Eliminar
                </button>
              </>
            )}
          </li>
        ))}

      </ul>
    </div>
  );
}

export default App;