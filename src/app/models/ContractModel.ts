import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

import { sequelize } from '../../config/database'

class Contract extends Model<InferAttributes<Contract>, InferCreationAttributes<Contract>> {
    declare id?: number
    declare customer_id: number
    declare customer_citizen_id: string
    declare customer_phone: string
    declare post_id: number
    declare amount: number
    declare commission: number
    declare status: 'pending' | 'approved' | 'rejected'
    declare clause: string
    declare created_at?: Date
    declare updated_at?: Date
}

Contract.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        customer_citizen_id: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        customer_phone: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
        },
        commission: {
            type: DataTypes.DECIMAL(14, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'pending',
        },
        clause: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: 'contracts',
        sequelize,
    },
)

export default Contract
