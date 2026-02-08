import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import { sequelize } from '../../config/database'

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    declare id?: number
    declare title: string
    declare description: string
    declare administrative_address: string
    declare sub_locality: string
    declare type: 'sell' | 'rent'
    declare images?: string
    declare approval_status: 'approved' | 'pending' | 'rejected'
    declare handover_status: 'not_delivered' | 'delivered'
    declare category_id: number
    declare user_id: number
    declare role: 'personal' | 'agent'
    declare created_at?: Date
    declare updated_at?: Date
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        administrative_address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        sub_locality: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('sell', 'rent'),
            allowNull: false,
            defaultValue: 'sell',
        },
        images: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        approval_status: {
            type: DataTypes.ENUM('approved', 'pending', 'rejected'),
            allowNull: false,
            defaultValue: 'pending',
        },
        handover_status: {
            type: DataTypes.ENUM('not_delivered', 'delivered'),
            allowNull: false,
            defaultValue: 'not_delivered',
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('personal', 'agent'),
            allowNull: false,
            defaultValue: 'personal',
        },
    },
    {
        tableName: 'posts',
        sequelize,
        defaultScope: {
            where: {
                approval_status: 'approved',
            },
        },
    },
)

export default Post
