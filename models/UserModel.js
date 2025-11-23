import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
