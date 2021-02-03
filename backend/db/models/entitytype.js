'use strict';
module.exports = (sequelize, DataTypes) => {
  const EntityType = sequelize.define('EntityType', {
    type: DataTypes.STRING(13)
  }, {});
  EntityType.associate = function(models) {
    EntityType.hasMany(models.Entity,{
      foreignKey: "typeId"
    })
  };
  return EntityType;
};
