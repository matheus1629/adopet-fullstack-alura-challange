import validateData from "../validation/validateSignupData.js";
import petRepository from "../repository/petRepository.js";
import BadRequestError from "../Errors/BadRequestError.js";
import { bufferToBase64 } from "../helpers/buffer.js";

const getAllPetsAvailable = async (page, pageSize) => {
  if (!page) page = 1;
  if (!pageSize || pageSize === 0) pageSize = 10;

  const pageSetting = {
    offset: (page - 1) * pageSize,
    limit: pageSize,
  };

  const petsData = await petRepository.getAllPetsAvailable(pageSetting);

  for (const key in petsData) {
    if (petsData[key].dataValues.picture) {
      petsData[key].dataValues.picture = bufferToBase64(
        petsData[key].dataValues.picture
      );
    }
  }

  return petsData;
};

const getAllPet = async () => {
  const petsData = await petRepository.getAllPets();

  for (const key in petsData) {
    if (petsData[key].dataValues.picture) {
      petsData[key].dataValues.picture = bufferToBase64(
        petsData[key].dataValues.picture
      );
    }
  }

  return petsData;
};

const getPetById = async (id) => {
  const petData = await petRepository.getPetById(id);

  if (petData.dataValues.picture)
    petData.dataValues.picture = bufferToBase64(petData.dataValues.picture);

  return petData;
};

const createPet = async (newPet, idDonor) => {
  delete newPet.adoptionDate;
  delete newPet.adopted;

  let errors = [];

  for (const key in newPet) {
    let error;
    if (key === "picture" && newPet.picture) {
      const base64Data = newPet[key].replace(/^data:.*?;base64,/, "");
      newPet.picture = Buffer.from(base64Data, "base64");
      error = validateData[key](newPet[key]);
    } else {
      error = validateData[key](newPet[key]);
    }
    if (error) errors.push(error);
  }

  if (errors.length > 0) {
    const errorMessage = `Validation errors: ${errors.join(", ")}`;
    throw new BadRequestError(errorMessage);
  }

  newPet.idDonor = idDonor;

  const petCreated = await petRepository.createPet(newPet);

  return petCreated.dataValues.id;
};

const updatePet = async (newPetInfo, idPet, idDonor) => {
  delete newPetInfo.adoptionDate;
  delete newPetInfo.adopted;
  delete newPetInfo.createdAt;
  delete newPetInfo.updatedAt;
  delete newPetInfo.idDonor;

  let errors = [];

  for (const key in newPetInfo) {
    let error;
    if (key === "picture" && newPetInfo.picture) {
      const base64Data = newPetInfo[key].replace(/^data:.*?;base64,/, "");
      newPetInfo.picture = Buffer.from(base64Data, "base64");
      error = validateData[key](newPetInfo[key]);
    } else {
      error = validateData[key](newPetInfo[key]);
    }
    if (error) errors.push(error);
  }

  if (errors.length > 0) {
    const errorMessage = `Validation errors: ${errors.join(", ")}`;
    throw new BadRequestError(errorMessage);
  }

  if (!(await petRepository.validateIfPetBelongsToDonor(idPet, idDonor))) {
    throw new BadRequestError(
      "You can't change a pet data that doesn't belongs to you"
    );
  }

  return await petRepository.updatePet(newPetInfo, idPet);
};

const deletePet = async (idPet,idDonor) => {

  if (!(await petRepository.validateIfPetBelongsToDonor(idPet, idDonor))) {
    throw new BadRequestError(
      "You can't change a pet data that doesn't belongs to you"
    );
  }

  const wasDeleted = await petRepository.deletePet(idPet);
  if (wasDeleted === 0)
    throw new BadRequestError(
      `You can't delete a pet that was already adopted`
    );
};

export default {
  getAllPetsAvailable,
  getAllPet,
  getPetById,
  createPet,
  updatePet,
  deletePet,
};