'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.changeColumn('posts', 'role', {
            type: Sequelize.ENUM('user', 'agent', 'personal'),
            allowNull: false,
            defaultValue: 'user',
        })

        await queryInterface.sequelize.query(`
            UPDATE posts SET role = 'personal' WHERE role = 'user'
        `)

        await queryInterface.changeColumn('posts', 'role', {
            type: Sequelize.ENUM('agent', 'personal'),
            allowNull: false,
            defaultValue: 'personal',
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.changeColumn('posts', 'role', {
            type: Sequelize.ENUM('user', 'agent'),
            allowNull: false,
            defaultValue: 'user',
        })
    },
}
