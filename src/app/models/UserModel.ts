import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import { sequelize } from '../../config/database'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id?: number
    declare first_name: string
    declare last_name: string
    declare full_name?: string
    declare nickname: string
    declare uuid: string
    declare email?: string
    declare password?: string
    declare avatar: string
    declare role: 'admin' | 'student'
    declare is_active: boolean
    declare is_blocked: boolean
    declare created_at?: Date
    declare updated_at?: Date
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
            allowNull: true,
            get() {
                const full_name = `${this.first_name} ${this.last_name}`
                return full_name.trim()
            },
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        uuid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        role: {
            type: DataTypes.ENUM('teacher', 'student'),
            allowNull: false,
            defaultValue: 'student',
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
