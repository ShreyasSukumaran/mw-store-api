const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const { validateToken } = require("../middleware/validate-token");

// router.all("*", [validateToken]);

router.get("/api-check", userController.apiCheck);
router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.get("/", [validateToken], userController.getUsers);
router.post("/", [validateToken], userController.postUser);
router.delete("/", [validateToken], userController.deleteUsers);
router.get("/:id", [validateToken], userController.getUser);
router.put("/:id", [validateToken], userController.putUser);
router.delete("/:id", [validateToken], userController.deleteUser);

module.exports = router;
