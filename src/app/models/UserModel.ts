import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import { sequelize } from '../../config/database'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id?: number
    declare first_name: string
    declare last_name: string
    declare full_name?: string
    declare nickname: string
    declare email?: string
    declare avatar?: string
    declare password?: string
    declare role: 'admin' | 'customer' | 'agent'
    declare address: string
    declare phone_number?: string
    declare is_active: boolean
    declare is_blocked: boolean
    declare created_at?: Date
    declare updated_at?: Date

    /**
     * Virtual field
     */
    declare total_posts?: number
}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        full_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.getDataValue('first_name')} ${this.getDataValue('last_name')}`
            },
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        role: {
            type: DataTypes.ENUM('admin', 'customer', 'agent'),
            allowNull: false,
            defaultValue: 'customer',
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'users',
        sequelize,
        defaultScope: {
            attributes: {
                exclude: ['password', 'email'],
            },
            where: {
                is_blocked: false,
            },
        },
        scopes: {
            withPassword: {
                attributes: {
                    exclude: ['email'],
                },
            },
            withEmail: {
                attributes: {
                    exclude: ['password'],
                },
            },
        },
    },
)

export default User
