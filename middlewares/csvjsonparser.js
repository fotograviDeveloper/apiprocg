const csv = require('csv-parser');
const fs = require('fs');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Eliminar el archivo temporal después de procesarlo
        fs.unlinkSync(filePath);
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
};

const transformProductData = (csvData) => {
  return csvData.map(item => ({
    sku: item['SKU'] || generateSKU(),
    category: item['Categoria'] || 'Otros',
    name: item['Nombre'],
    description: item['Descripcion'] || '',
    price: parseFloat(item['Precio']) || 0,
    unit: item['Unidad'] || 'pieza',
    stock: parseInt(item['Inventario']) || 0,
    brand: item['Marca'] || '',
    specifications: {
      voltage: item['Voltaje'] || '',
      color: item['Color'] || '',
      material: item['Material'] || ''
    }
  }));
};

function generateSKU() {
  const prefix = 'PROD';
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${randomNum}`;
}

module.exports = { parseCSV, transformProductData };