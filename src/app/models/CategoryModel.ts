import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import { sequelize } from '../../config/database'

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    declare id?: number
    declare name: string
    declare created_at?: Date
    declare updated_at?: Date
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'categories',
        sequelize,
    },
)

export default Category
