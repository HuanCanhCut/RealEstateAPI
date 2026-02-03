import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import { sequelize } from '../../config/database'

class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
    declare id?: number
    declare user_id: number
    declare refresh_token: string
    declare created_at?: Date
    declare updated_at?: Date
}

RefreshToken.init(
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
        refresh_token: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
    },
    {
        tableName: 'refresh_tokens',
        sequelize,
    },
)

export default RefreshToken
