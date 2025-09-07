const { DataTypes } = require('sequelize');
const BaseEntity = require('./base.entity');

class UserProgress extends BaseEntity {
     static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        this.belongsTo(models.StudyGuide, {
            foreignKey: 'study_guide_id',
            as: 'studyGuide'
        });
    }
    static initModel(sequelize) {
        super.init(
            {
                user_id: {
                    type: DataTypes.UUID,
                    allowNull: false
                },
                study_guide_id: {
                    type: DataTypes.UUID,
                    allowNull: false
                },
                completed: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                completed_at: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: 'UserProgress',
                tableName: 'user_progress'
            }
        );
    }
}

module.exports = UserProgress;
