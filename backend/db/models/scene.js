'use strict';
module.exports = (sequelize, DataTypes) => {
  const Scene = sequelize.define('Scene', {
    parentId: DataTypes.INTEGER,
    order: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {});
  Scene.associate = function(models) {
    Scene.belongsTo(models.Entity, {
      foreignKey: "parentId"
    })
  };
  return Scene;
};
