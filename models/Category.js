module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Category', {
      name: { type: DataTypes.STRING(50), allowNull: false },
      description: DataTypes.TEXT,
      slug: { type: DataTypes.STRING(100), unique: true },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, {
      timestamps: true,
      underscored: true
    });
  };
  