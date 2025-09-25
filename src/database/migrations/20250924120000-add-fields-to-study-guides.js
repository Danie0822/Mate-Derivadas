"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Añadir los campos faltantes para el nuevo enfoque de guias de estudio
        await queryInterface.addColumn("study_guides", "topic", {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: "Tema o categoría de la guía de estudio"
        });

        await queryInterface.addColumn("study_guides", "level", {
            type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
            allowNull: true,
            defaultValue: 'beginner',
            comment: "Nivel de dificultad de la guía"
        });

        await queryInterface.addColumn("study_guides", "tags", {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: "Etiquetas para categorización y búsqueda"
        });

        await queryInterface.addColumn("study_guides", "content", {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: "Contenido educativo rico (teoría, ejemplos, notas)"
        });

        await queryInterface.addColumn("study_guides", "exercises", {
            type: Sequelize.JSONB,
            allowNull: true,
            defaultValue: [],
            comment: "Lista de ejercicios relacionados con sus metadatos"
        });
    },

    async down(queryInterface, Sequelize) {
        // Remover los campos añadidos
        await queryInterface.removeColumn("study_guides", "exercises");
        await queryInterface.removeColumn("study_guides", "content");
        await queryInterface.removeColumn("study_guides", "tags");
        await queryInterface.removeColumn("study_guides", "level");
        await queryInterface.removeColumn("study_guides", "topic");
        
        // Remover el ENUM creado
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_guides_level";');
    },
};