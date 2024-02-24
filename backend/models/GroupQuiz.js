'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class GroupQuiz extends Model {
    static associate(models) {
      this.belongsTo(models.Group, { foreignKey: 'groupId' });
      this.hasMany(models.GroupQuizQuestion, { foreignKey: 'quizId' });
    }
  }

  GroupQuiz.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'GroupQuiz',
      timestamps: true,
    }
  );

  return GroupQuiz;
};
