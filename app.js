import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import { connectDB } from "./dbconfig/dbconfig.js";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "10mb" }))
app.use("/api/properties", propertyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend running!" });
  console.log("Server is up and running");
});

app.use("/api/auth", authRoutes);

// app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});


