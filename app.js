import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./dbconfig/dbconfig.js";

dotenv.config();

// Routes
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; 

const app = express();


app.use(cors());
app.use(express.json({ limit: "10mb" }));


app.use("/api/auth", authRoutes);
app.use("/api", propertyRoutes);
app.use("/api/upload", uploadRoutes); 


app.get("/", (req, res) => {
  res.json({ message: "Backend running!" });
  console.log("Server is up and running");
});

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
