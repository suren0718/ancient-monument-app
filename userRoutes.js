const express = require("express");
const {
  registerUser,
  loginUser,
  addFavouriteMonument,
  removeFavouriteMonument,
  searchMonument,
  displayAll,
} = require("./userControllers");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/addFavourite", addFavouriteMonument);
router.post("/removeFavourite", removeFavouriteMonument);
router.get("/search", searchMonument);
router.get("/", displayAll);

module.exports = router;
