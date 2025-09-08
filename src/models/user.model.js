// src/models/area.model.js
const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity'); // Solo si usas una clase base

class User extends BaseEntity {
    static associate(models) {
        this.hasMany(models.UserProgress, {
            foreignKey: 'user_id',
            as: 'progress'
        });
        this.hasMany(models.UserExercise, {
            foreignKey: 'user_id',
            as: 'exercises'
        });
        this.hasMany(models.Conversation, {
            foreignKey: 'user_id',
            as: 'conversations'
        });
    }
    static initModel(sequelize) {
        super.init(
            {
                full_name: {
                    type: DataTypes.STRING(250),
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING(250),
                    allowNull: true
                },
                rol: {
                    type: DataTypes.ENUM('admin', 'user'),
                    allowNull: false
                },
                cellphone: {
                    type: DataTypes.STRING(20),
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING(250),
                    allowNull: false
                }

            },
            {
                sequelize,
                modelName: 'User',
                tableName: 'Users'
            }
        );
    }
}

module.exports = User;