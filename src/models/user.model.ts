import { Schema, model, Document } from "mongoose";

// Define interface for User document
interface UserDocument extends Document {
  fullname: string;
  password: string;
  email: string;
  mobileNumber: string;
  role: string;
  isEmailVerified: boolean;
  isMobileNumberVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define User schema
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    mobileNumber: {
      type: String,
      required: true
    },
    isMobileNumberVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User"
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({
  fullname: 1
});

const userModel = model("users", userSchema);
export { userSchema, userModel, UserDocument };
