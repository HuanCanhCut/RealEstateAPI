import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import { sequelize } from '../../config/database'

class Favorite extends Model<InferAttributes<Favorite>, InferCreationAttributes<Favorite>> {
    declare id?: number
    declare user_id: number
    declare post_id: number
    declare created_at?: Date
    declare updated_at?: Date
}

Favorite.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'favorites',
        sequelize,
    },
)

export default Favorite
