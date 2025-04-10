module.exports = (sequelize, DataTypes) => {
    return sequelize.define('QuoteItem', {
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
    }, {
      timestamps: false,
      underscored: true
    });
  };
  