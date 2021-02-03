'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pseudonym = sequelize.define('Pseudonym', {
    firstName: {
      type: DataTypes.STRING(50),
      validate: {
        len: [1, 50]
      }
    },
    middleName: {
      type: DataTypes.STRING(50),
      validate: {
        len: [1, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING(50),
      validate: {
        len: [1, 50]
      }
    },
    userId: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {});
  Pseudonym.associate = function(models) {
    Pseudonym.belongsTo(models.User, {
      foreignKey: "userId"
    })

    Pseudonym.hasMany(models.Entity, {
      foreignKey: "pseudonymId"
    })
  };
  return Pseudonym;
};
