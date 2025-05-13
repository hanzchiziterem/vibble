import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
//Fetch Users.
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; //This is avaliable, when protectedRoute phase is passed.

    //Find all users except the one currently logged in.
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//Get messages between two users.
export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const senderId = req.user._id; //Currently Authenticated User(myId).

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: id },
        { senderId: id, receiverId: senderId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

//Send a Message.
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id } = req.params; //receiverId.
    const senderId = req.user._id;

    //Check if user sent an image.
    let imageUrl;
    if (image) {
      //Upload base64 image to cloudinary
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = new Message({
      senderId,
      id,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
