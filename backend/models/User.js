'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
    class User extends Model {
        static associate(models) {}
    }

    User.init(
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
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'active',
            },
        },
        {
            sequelize,
            modelName: 'User',
            timestamps: true,
        }
    );

    return User;
};
