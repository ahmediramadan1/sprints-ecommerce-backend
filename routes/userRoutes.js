const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post(
  "/purchase/:userId/:productId",
  authController.protectRoute,
  userController.purchase
);

router.patch(
  "/updateAccount",
  authController.protectRoute,
  userController.updateAccount
);
router.patch(
  "/updatePassword",
  authController.protectRoute,
  authController.updatePassword
);

router.delete(
  "/deleteAccount",
  authController.protectRoute,
  userController.deleteAccount
);

module.exports = router;
