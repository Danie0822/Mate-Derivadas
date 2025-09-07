"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Habilita la extensión uuid-ossp si no existe
    return queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Opcional: puedes remover la extensión si lo deseas
    return queryInterface.sequelize.query(
      'DROP EXTENSION IF EXISTS "uuid-ossp";'
    );
  }
};
