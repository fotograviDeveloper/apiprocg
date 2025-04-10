module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Quote', {
      client_name: { type: DataTypes.STRING(100), allowNull: false },
      client_email: DataTypes.STRING(100),
      client_phone: DataTypes.STRING(20),
      subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      tax: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      discount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
      total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
      status: {
        type: DataTypes.ENUM('draft', 'sent', 'approved', 'rejected'),
        defaultValue: 'draft'
      }
    }, {
      timestamps: true,
      underscored: true
    });
  };
  