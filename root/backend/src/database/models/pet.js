"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Pet extends Model {
    static associate(models) {
      Pet.belongsTo(models.Donor, {
        foreignKey: "id_donor",
      });
      Pet.belongsTo(models.Adopter, {
        foreignKey: "id_adopter",
      });
      Pet.hasMany(models.Message, {
        foreignKey: "id_pet",
        onDelete: "CASCADE",
      });
    }
  }
  Pet.init(
    {
      name: DataTypes.STRING,
      age: DataTypes.TINYINT.UNSIGNED,
      size: DataTypes.STRING,
      description: DataTypes.STRING,
      picture: DataTypes.BLOB("medium"),
      adoptionDate: { type: DataTypes.DATEONLY, field: "adoption_date" },
      adopted: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
      idDonor: { type: DataTypes.INTEGER, field: "id_donor" },
    },
    {
      sequelize,
      modelName: "Pet",
    }
  );
  return Pet;
};
