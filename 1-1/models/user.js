const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstname is required"],
      minlength: [3, "firstname must be equal or more than 3 character"],
      maxlength: [30, "firstname must be equal or less than 30 character"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "lastname is required"],
      minlength: [3, "lastname must be equal or more than 3 character"],
      maxlength: [30, "lastname must be equal or less than 30 character"],
      trim: true,
    },
    userName: {
      type: String,
      required: [true,"username is required"],
      unique: [true,"user name must be unique"],
      trim: true,
    },
    password: {
      type: String,
      required: [true,"password is required"],
      minlength: [8, "password must be equal or more than 8 characters"],
      validate: {
        validator: function (v) {
          return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(v);
        },
      },
    },
    gender: {
      type: String,
      default: "not-set",
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "invalid gender ({VALUE}): role is eather user or admin",
      },
      default: "user",
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

module.exports = model("user", UserSchema);
