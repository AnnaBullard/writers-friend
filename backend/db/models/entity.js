'use strict';
module.exports = (sequelize, DataTypes) => {
  const Entity = sequelize.define('Entity', {
    title: DataTypes.STRING(255),
    description: DataTypes.STRING(1000),
    userId: DataTypes.INTEGER,
    pseudonymId: DataTypes.INTEGER,
    typeId: DataTypes.INTEGER,
    parentId: DataTypes.INTEGER,
    order: DataTypes.INTEGER,
    isPublished: DataTypes.BOOLEAN
  }, {});
  Entity.associate = function(models) {
    Entity.belongsTo(models.User,{
      foreignKey: "userId"
    })

    Entity.belongsTo(models.Pseudonym,{
      foreignKey: "pseudonymId"
    })
    
    Entity.belongsTo(models.EntityType,{
      foreignKey: "typeId"
    })
    
    Entity.belongsTo(models.Entity,{
      foreignKey: "parentId",
      as: "child"
    })

    Entity.hasMany(models.Entity,{
      foreignKey: "parentId",
      as: "parent"
    })

    Entity.hasMany(models.Entity,{
      foreignKey: "parentId"
    })

  };
  return Entity;
};
