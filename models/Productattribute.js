module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Productattribute', {
      attribute_name: { type: DataTypes.STRING(50), allowNull: false },
      attribute_value: { type: DataTypes.TEXT, allowNull: false }
    }, {
      timestamps: false,
      underscored: true
    });
  };
  