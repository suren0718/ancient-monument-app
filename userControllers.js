const bcrypt = require("bcryptjs");
const { User, Monument } = require("./user");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email: email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      email: newUser.email,
      favouriteMonuments: newUser.favouriteMonuments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email: email });

    if (!userExists) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
    const isMatch = await bcrypt.compare(password, userExists.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      message: "Login successful",
      email: userExists.email,
      favouriteMonuments: userExists.favouriteMonuments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a monument to user's favorite list
const addFavouriteMonument = async (req, res) => {
  const { email, id } = req.body;
  try {
    const userExists = await User.findOne({ email: email });
    if (!userExists) {
      return res.status(400).json({ message: "Please Login to Continue" });
    }
    const monument = await Monument.findById(id);
    if (!monument) {
      return res.status(400).json({ message: "Monument doesn't exist" });
    }
    await User.updateOne(
      { email: email },
      { $push: { favouriteMonuments: monument._id } }
    );
    res.status(200).json({ message: "Monument added to favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const removeFavouriteMonument = async (req, res) => {
  const { email, id } = req.body;
  try {
    const userExists = await User.findOne({ email: email });
    if (!userExists) {
      return res.status(400).json({ message: "Please Login to Continue" });
    }
    const monument = await Monument.findById(id);
    if (!monument) {
      return res.status(400).json({ message: "Monument doesn't exist" });
    }
    await User.updateOne(
      { email: email },
      { $pull: { favouriteMonuments: monument._id } }
    );
    res.status(200).json({ message: "Monument removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const searchMonument = async (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  try {
    const monuments = await Monument.find({
      name: { $regex: q, $options: "i" },
    });
    res.status(200).json(monuments);
  } catch (error) {
    console.error("Error searching monuments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const displayAll = async (req, res) => {
  try {
    const monuments = await Monument.find({});
    res.status(200).json(monuments);
  } catch (error) {
    console.error("Error displaying monuments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  addFavouriteMonument,
  removeFavouriteMonument,
  searchMonument,
  displayAll,
};
