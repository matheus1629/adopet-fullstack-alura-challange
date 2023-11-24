"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Message", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      adoption_status: {
        type: Sequelize.ENUM("pending_confirmation", "donor_accepted", "donor_refused"),
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING(70),
        allowNull: false,
      },
      contact_message: {
        type: Sequelize.STRING(2000),
        allowNull: false,
      },
      date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("now") },
      id_adopter: {
        allowNull: false,
        type: Sequelize.UUID,
        references: { model: "adopter", key: "id" },
      },
      id_pet: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "pet", key: "id" },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Message");
  },
};
