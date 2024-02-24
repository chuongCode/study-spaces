'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class GroupQuizQuestion extends Model {
    static associate(models) {
      this.belongsTo(models.GroupQuiz, { foreignKey: 'quizId' });
    }
  }

  GroupQuizQuestion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      answers: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      correctAnswerIndex: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'GroupQuizQuestion',
      timestamps: true,
    }
  );

  return GroupQuizQuestion;
};
