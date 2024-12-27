const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Path to local JSON file storing user data
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper function to read user data from the file
const readUserData = () => {
  const rawData = fs.readFileSync(usersFilePath);
  return JSON.parse(rawData);
};

// Helper function to write user data to the file
const writeUserData = (data) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
};

// Register a new user
const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = readUserData();
    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      favoriteMonuments: [],
    };

    users.push(newUser);
    writeUserData(users);

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = readUserData();
    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user.id, favoriteMonuments: user.favoriteMonuments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a monument to user's favorite list
const addFavoriteMonument = async (req, res) => {
  const { userId, monumentName } = req.body;

  try {
    const users = readUserData();
    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favoriteMonuments.push(monumentName);
    writeUserData(users);

    res.status(200).json({ message: 'Monument added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, addFavoriteMonument };
