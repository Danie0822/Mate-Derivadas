'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('exercises', 'topic', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Topic or category of the exercise'
    });

    await queryInterface.addColumn('exercises', 'tags', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
      comment: 'Array of tags for categorization and searching'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('exercises', 'topic');
    await queryInterface.removeColumn('exercises', 'tags');
  }
};