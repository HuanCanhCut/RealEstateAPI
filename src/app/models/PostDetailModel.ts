import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import { sequelize } from '../../config/database'

class PostDetail extends Model<InferAttributes<PostDetail>, InferCreationAttributes<PostDetail>> {
    declare id?: number
    declare post_id: number
    declare bedrooms?: number
    declare bathrooms?: number
    declare balcony?: string
    declare main_door?: string
    declare legal_documents?: string
    declare interior_status?: string
    declare area?: number
    declare price?: number
    declare deposit?: number
    declare created_at?: Date
    declare updated_at?: Date
}

PostDetail.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bedrooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        bathrooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        balcony: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        main_door: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        legal_documents: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        interior_status: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        area: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: true,
        },
        deposit: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: true,
        },
    },
    {
        tableName: 'post_details',
        sequelize,
    },
)

PostDetail.prototype.toJSON = function () {
    const values = { ...this.get() }
    if ('deposit' in values) {
        values.deposit = Number(values.deposit)
    }

    if ('price' in values) {
        values.price = Number(values.price)
    }

    return values
}

export default PostDetail
