import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    address: {
      type: String,
    },

    roles: {
      type: String,
      enum: ["student", "teacher", "other", "admin"],
      default: "student",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", schema);
