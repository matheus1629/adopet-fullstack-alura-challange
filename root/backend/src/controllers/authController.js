import authConfig from "../config/auth.config.js";
import adopterService from "../services/adopterService.js";
import authService from "../services/authService.js";
import jwt from "jsonwebtoken";
import donorService from "../services/donorService.js";

const createUser = (userType) => async (req, res) => {
  delete req.body.confirmPassword;
  const newUser = req.body;

  try {
    let createdUser;

    if (userType === "Adopter") {
      const createdUserId = await adopterService.createAdopter(newUser);
      createdUser = await adopterService.getAdopterById(createdUserId);
    }

    if (userType === "Donor") {
      const createdUserId = await donorService.createDonor(newUser);

      createdUser = await donorService.getDonorById(createdUserId);
    }

    const payload = { userId: createdUser.id };
    const token = jwt.sign(payload, authConfig.secret, { expiresIn: "24h" });

    return res.status(201).json({ token: token, userType: userType });
  } catch (error) {
    if (error.name === "BadRequestError") return res.status(400).json(error.message);

    return res.status(500).json(error.message);
  }
};

const userLogin = (userType) => async (req, res) => {
  const { email, password } = req.body;

  try {
    const userLogged = await authService.login(userType, email, password);
    const userLoggedData = userLogged.get();

    try {
      const payload = { userId: userLoggedData.id };
      const token = jwt.sign(payload, authConfig.secret, { expiresIn: "24h" });

      return res.status(200).json({ token: token, userType: userType });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  } catch (error) {
    if (error.name === "BadRequestError") return res.status(401).json(error.message);

    return res.status(500).json(error.message);
  }
};

export default {
  createUser,
  userLogin,
};
