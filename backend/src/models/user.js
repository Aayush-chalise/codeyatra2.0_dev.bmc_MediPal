import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
  },

  password: {
    type: String,
  },

  address: {
    type: String,
  },

  role: {
    type: String,
    enum: ["patient", "admin"],
    default: "patient",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

userSchema.pre("save" , async function () {
    if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password , 10)
    }
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
export default mongoose.model("User", userSchema);