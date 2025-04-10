const express = require('express');
const router = express.Router(); // ¡Define el router aquí!

// Ejemplo de ruta (ajusta según tu lógica)
router.get('/', (req, res) => {
    res.json({ message: "Ruta de upload funcionando" });
   
});

// Exporta el router
module.exports = router;