 const express = require("express");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
);


// ======================================
// LISTAR PRODUCTOS - PUNTO 7
// ======================================

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


// ======================================
// CREAR PRODUCTO - PUNTO 6
// ======================================

app.post("/api/productos", async (req, res) => {

    const {
        nombre,
        precio,
        categoria_id,
        cantidad
    } = req.body;

    const { data, error } = await supabase
        .from("productos")
        .insert([
            {
                nombre: nombre,
                precio: precio,
                categoria_id: categoria_id,
                cantidad: cantidad
            }
        ])
        .select();

    if (error) {
        console.error("Error al guardar:", error);
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data[0]);
});


// ======================================
// EDITAR PRODUCTO - PUNTO 8
// ======================================

app.put("/api/productos/:id", async (req, res) => {

    const id = req.params.id;

    const {
        nombre,
        precio,
        categoria_id,
        cantidad
    } = req.body;

    const { data, error } = await supabase
        .from("productos")
        .update({
            nombre: nombre,
            precio: precio,
            categoria_id: categoria_id,
            cantidad: cantidad
        })
        .eq("id", id)
        .select();

    if (error) {
        console.error("Error al editar:", error);
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data[0]);
});


// ======================================
// ELIMINAR PRODUCTO - PUNTO 9
// ======================================

app.delete("/api/productos/:id", async (req, res) => {

    const id = req.params.id;

    const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id);

    if (error) {

        console.error("Error al eliminar:", error);

        return res.status(500).json({
            error: error.message
        });

    }

    res.json({
        mensaje: "Producto eliminado correctamente"
    });

});


// ======================================
// PÁGINA PRINCIPAL
// ======================================

app.get("/", (req, res) => {

    res.sendFile(
        __dirname + "/public/index.html"
    );

});


// ======================================
// SERVIDOR
// ======================================

app.listen(PORT, () => {

    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );

});