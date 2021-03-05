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
      as: "parent"
    })

    Entity.hasMany(models.Entity,{
      foreignKey: "parentId",
      as: "children",
      onDelete: 'CASCADE',
      hooks:true
    })

    Entity.hasMany(models.Scene,{
      foreignKey: "parentId",
      onDelete: 'CASCADE',
      hooks:true
    })

    Entity.addScope("fullInfo", {
      include: {
          model: models.Pseudonym
      }
    })

  };

  Entity.getEntitiesPerUser = async function (id) {
    let entities = await Entity.scope('fullInfo')
      .findAll({
        where:{ 
          userId: id
        },
        order: ["parentId", "order"]
      });

      let parentsObject = {0:[]};

      entities = entities.map(entity => entity.toJSON());

      entities.forEach(entity => {
        if (entity.parentId === null) {
          parentsObject[0].push(entity);
        } else {
          if (!parentsObject[entity.parentId]) {
            parentsObject[entity.parentId] = [];
          }
          parentsObject[entity.parentId].push(entity);
        }
      });

      entities.forEach(entity => {
        if (parentsObject[entity.id]){
          entity.children = [...parentsObject[entity.id]]
        }
      });

      let entitiesTree = [...parentsObject[0]];

      return entitiesTree
  };

  return Entity;
};

