// models/Property.js
import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },

    // LOCATION
    city: { type: String, index: true },
    area: { type: String, index: true },
    address: String,
    nearby_station: String,

    // CATEGORY
    category: {
      type: String,
      enum: [
        "none",
        "warehouse",
        "shared_warehouse",
        "factory",
        "plot",
        "showroom",
        "shop",
      ],
      default: "none",
      index: true,
    },

    // INDUSTRIAL DETAILS
    builtup_area: { type: Number, index: true },
    open_area: Number,
    building_type: { type: String, index: true }, // rcc, peb, rcc_peb, etc.
    ceiling_height: { type: Number, index: true },
    construction_year: Number,
    loading_docks: Number,
    power_kw: { type: Number, index: true },

    // BOOLEAN AMENITIES
    security_room: { type: Boolean, index: true, default: false },
    cctv: { type: Boolean, index: true, default: false },
    mezzanine_floor: { type: Boolean, index: true, default: false },
    parking: { type: Boolean, index: true, default: false },

    // OWNER
    owner_name: String,
    owner_contact: { type: String, required: true, index: true },

    // IMAGES (multiple URLs uploaded to Firebase by frontend)
    images: { type: [String], default: [] },

    // STATUS
    status: {
      type: String,
      enum: ["available", "booked", "sold"],
      default: "available",
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index example (helpful if you often query city + category + builtup range)
PropertySchema.index({ city: 1, category: 1, builtup_area: -1 });

export default mongoose.model("Property", PropertySchema);
