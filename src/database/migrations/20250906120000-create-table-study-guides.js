"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("study_guides", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.literal("uuid_generate_v4()"),
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            week: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            day: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            resources: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("study_guides");
    },
};
