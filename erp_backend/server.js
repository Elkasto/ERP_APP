const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
const port = 3000;

// Middlewares para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Endpoints para CRUD de productos

// Obtener todos los productos
app.get('/Products', async (req, res) => {
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
        const product = await db.Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        await product.update(req.body);
        return res.json(product);
    } catch (error) {
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

// Sincroniza la base de datos y arranca el servidor
db.sequelize.sync({ force: false }).then(() => {
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
});