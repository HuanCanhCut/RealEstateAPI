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
        await queryInterface.createTable('posts', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            administrative_address: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            sub_locality: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('sell', 'rent'),
                allowNull: false,
                defaultValue: 'sell',
            },
            images: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            approval_status: {
                type: Sequelize.ENUM('approved', 'pending', 'rejected'),
                allowNull: false,
                defaultValue: 'pending',
            },
            handover_status: {
                type: Sequelize.ENUM('not_delivered', 'delivered'),
                allowNull: false,
                defaultValue: 'not_delivered',
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            role: {
                type: Sequelize.ENUM('user', 'agent'),
                allowNull: false,
                defaultValue: 'user',
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
        await queryInterface.dropTable('posts')
    },
}
