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
        await queryInterface.createTable('post_details', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            post_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'posts',
                    key: 'id',
                },
            },
            bedrooms: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            bathrooms: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            balcony: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            main_door: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            legal_documents: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            interior_status: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            area: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            price: {
                type: Sequelize.DECIMAL(14, 2),
                allowNull: true,
            },
            deposit: {
                type: Sequelize.DECIMAL(14, 2),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('post_details')
    },
}
