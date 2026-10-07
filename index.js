 const express = require("express");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();

// Permite recibir datos en formato JSON
app.use(express.json());

// Permite mostrar los archivos de la carpeta public
app.use(express.static("public"));

// Puerto para local y para Render
const PORT = process.env.PORT || 3000;

// Conexión con Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
);

// ================================
// MOSTRAR PRODUCTOS
// ================================
app.get("/api/productos", async (req, res) => {
    const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error al listar:", error);
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

// ================================
// CREAR PRODUCTO
// ================================
app.post("/api/productos", async (req, res) => {
    const { nombre, precio, categoria_id, cantidad } = req.body;

    const { data, error } = await supabase
        .from("productos")
        .insert([
            {
                nombre,
                precio,
                categoria_id,
                cantidad
            }
        ])
        .select();

    if (error) {
        console.error("Error al crear:", error);
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

// ================================
// EDITAR PRODUCTO
// ================================
app.put("/api/productos/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, categoria_id, cantidad } = req.body;

    const { data, error } = await supabase
        .from("productos")
        .update({
            nombre,
            precio,
            categoria_id,
            cantidad
        })
        .eq("id", id)
        .select();

    if (error) {
        console.error("Error al actualizar:", error);
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

// ================================
// ELIMINAR PRODUCTO
// ================================
app.delete("/api/productos/:id", async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        console.error("Error al eliminar:", error);
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
});

// ================================
// PÁGINA PRINCIPAL
// ================================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// ================================
// INICIAR SERVIDOR
// ================================
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});