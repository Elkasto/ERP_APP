const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
const port = 3002;

// Middlewares para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Endpoints para CRUD de productos

// Obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await db.Product.findAll();
        return res.json(products);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo producto
app.post('/products', async (req, res) => {
  try {
    console.log('📨 Recibido producto:', req.body); //Verificar que los datos esten llegandos
    const newProduct = await db.Product.create(req.body);
    console.log('✅ Producto guardado:', newProduct.toJSON());
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al guardar producto:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto por ID
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        
        await product.destroy();
        return res.json({ message: 'Producto eliminado' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Actualizar producto
app.put('/products/:id', async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    await product.update(req.body);
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Autenticar la conexión (opcional pero útil para logs)
db.sequelize.authenticate()
  .then(() => console.log('✅ Conexión con SQLite establecida correctamente.'))
  .catch(err => console.error('⛔ Error al conectar con SQLite:', err));

// Sincronizar y levantar el servidor
db.sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
});