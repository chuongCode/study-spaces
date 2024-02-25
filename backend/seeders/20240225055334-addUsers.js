'use strict';

const { User } = require('../models'); // Adjust the path as per your project structure

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Sample user data
        const usersData = [
            { name: 'John Doe', password: 'password1' },
            { name: 'Jane Smith', password: 'password2' },
            { name: 'Mike Johnson', password: 'password3' },
            { name: 'Jassem Toumi', password: 'password4' },
            // Add more sample users as needed
        ];

        // Insert sample data into the database
        await User.bulkCreate(usersData);
    },

    down: async (queryInterface, Sequelize) => {
        // Remove all inserted data
        await User.destroy({ where: {} });
    },
};
