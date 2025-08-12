import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    fullName: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverimage: {
      type: String,
    },

    refreshToken: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// userSchema.method.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

//creating the access token
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

//creating the refresh token

//the refresh token are long live tooken this token come in use when the access tokon of user are expired and user want to relogin in this case if user have same refresh token as database then user just need to hit some end point and then the user can login without giving the password
// userSchema.method.createRefreshToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     }
//   );
// };



export const User = mongoose.model("User", userSchema);
