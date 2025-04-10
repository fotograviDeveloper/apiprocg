// filepath: c:\Users\MARKETING\Desktop\apps\api_cg\models\Product.js
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        sku: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        }
        
    });

    return Product;
};

