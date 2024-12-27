const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    favouriteMonuments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Monument",
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const monumentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Monument = mongoose.model("Monument", monumentSchema);

module.exports = { User, Monument };
