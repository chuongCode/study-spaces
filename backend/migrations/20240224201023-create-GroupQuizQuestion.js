'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('GroupQuizQuestions', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            quizId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'GroupQuizzes',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            question: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            answers: {
                type: Sequelize.JSON,
                allowNull: false,
            },
            correctAnswerIndex: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('GroupQuizQuestions');
    },
};
