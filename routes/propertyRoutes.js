import express from "express";
import { createProperty, listProperties, getPropertyById } from "../controllers/propertyController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Upload up to 10 images
router.post("/postproperties", upload.array("images", 10), createProperty);
router.get("/properties", listProperties);
router.get("/properties/:id", getPropertyById);

export default router;
