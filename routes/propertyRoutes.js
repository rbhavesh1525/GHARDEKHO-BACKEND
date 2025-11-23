// routes/propertyRoutes.js
import express from "express";
import { createProperty, listProperties, getPropertyById } from "../controllers/propertyController.js";

const router = express.Router();

router.post("/", createProperty);         // POST /api/properties
router.get("/", listProperties);         
router.get("/:id", getPropertyById);     

export default router;
