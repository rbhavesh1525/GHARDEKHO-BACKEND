import axios from "axios";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    // SAVE OTP TEMPORARILY IN SESSION/MEMORY
    req.app.locals.otpStore = req.app.locals.otpStore || {};
    req.app.locals.otpStore[phone] = otp;

    // SEND VIA MSG91
    await axios.post(
      `https://control.msg91.com/api/v5/otp`,
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: `91${phone}`,
        otp,
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
        },
      }
    );

    return res.json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "OTP sending failed" });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp, name, email, password } = req.body;

    const otpStore = req.app.locals.otpStore || {};
    if (otpStore[phone] != otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Remove OTP after verification
    delete otpStore[phone];

    // Save user
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    // JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, user });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};
