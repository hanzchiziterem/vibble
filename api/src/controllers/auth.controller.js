import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//SIGNUP

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    //Checks if one of the fields are empty.
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    //minimun of character length.
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters." });
    }

    //search parameter for users is by email.
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists." });

    //generate hash algo using bcrypt.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //Once we save the user to database we generate a token(jwt).
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error," });
  }
};

// LOGIN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check if one of the input fields are empty.
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required." });
    }

    //Paramter for Credentials ID.
    const user = await User.findOne({ email });
    //if email doesn't exist.
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    //Compare user input and data stored.
    const isPassordCorrect = await bcrypt.compare(password, user.password); //returns bool.
    if (!isPassordCorrect) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in the 'Login Controller':", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//LOGOUT

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error in the 'Logout Controller':", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//UPDATE-PROFILE

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      res.status(400).json({ message: "Profile Pic is required" });
    }
    //Upload the image.
    const uploadRes = await cloudinary.uploader.upload(profilePic);
    //Update the database.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadRes.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile", error.nessage);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//AUTHENTICATED-USER

export const checkAuth = (req,res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in CheckAuth Controller", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
