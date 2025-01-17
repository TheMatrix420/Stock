'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Perfils', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      img: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
      //TODO:Hacer la asociación con modelo perfin para que se cree con db:migrate
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Perfils');
  }
};