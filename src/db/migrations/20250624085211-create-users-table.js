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

        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: '',
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: '',
            },
            academic_degree: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            uuid: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            avatar: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: '',
            },
            password: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: '',
            },
            role: {
                type: Sequelize.ENUM('teacher', 'student'),
                allowNull: false,
                defaultValue: 'student',
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            is_blocked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
        await queryInterface.dropTable('users')
    },
}
