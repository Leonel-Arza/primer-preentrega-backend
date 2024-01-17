const express = require("express");
const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
    res.send("¡Hola, bienvenidos a mi primer preentrega!");
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
