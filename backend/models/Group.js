'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Group extends Model {
    static associate(models) {
      // Define associations here if needed
      this.hasMany(models.GroupContent, { foreignKey: 'groupId' });
      this.hasMany(models.GroupQuiz, { foreignKey: 'groupId' });
    }
  }

  Group.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      }
    },
    {
      sequelize,
      modelName: 'Group',
      timestamps: true,
    }
  );

  return Group;
};
