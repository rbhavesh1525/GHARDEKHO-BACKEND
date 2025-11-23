// controllers/propertyController.js
import Property from "../models/propertyModel.js";

/**
 * POST /api/properties
 * Body (JSON) expected:
 * {
 *   title: "Factory near MIDC",
 *   description: "...",
 *   city: "Pune",
 *   area: "Chakan",
 *   address: "...",
 *   category: "factory",
 *   builtup_area: 15000,
 *   open_area: 8000,
 *   building_type: "rcc",
 *   ceiling_height: 20,
 *   construction_year: 2018,
 *   loading_docks: 2,
 *   power_kw: 250,
 *   security_room: true,
 *   cctv: true,
 *   mezzanine_floor: false,
 *   parking: true,
 *   owner_name: "Rahul",
 *   owner_contact: "98xxxxxxxx",
 *   images: ["https://.../img1.jpg", "https://.../img2.jpg"]
 * }
 */
export const createProperty = async (req, res) => {
  try {
    const payload = req.body;

    // Basic server-side validation
    if (!payload.title || !payload.owner_contact) {
      return res.status(400).json({ success: false, message: "title and owner_contact are required" });
    }

    // ensure images is array (frontend should send array)
    if (payload.images && !Array.isArray(payload.images)) {
      return res.status(400).json({ success: false, message: "images must be an array of URLs" });
    }

    const property = await Property.create({
      title: payload.title,
      description: payload.description || "",
      city: payload.city || "",
      area: payload.area || "",
      address: payload.address || "",
      nearby_station: payload.nearby_station || "",
      category: payload.category || "none",
      builtup_area: payload.builtup_area ? Number(payload.builtup_area) : undefined,
      open_area: payload.open_area ? Number(payload.open_area) : undefined,
      building_type: payload.building_type || "none",
      ceiling_height: payload.ceiling_height ? Number(payload.ceiling_height) : undefined,
      construction_year: payload.construction_year ? Number(payload.construction_year) : undefined,
      loading_docks: payload.loading_docks ? Number(payload.loading_docks) : undefined,
      power_kw: payload.power_kw ? Number(payload.power_kw) : undefined,
      security_room: !!payload.security_room,
      cctv: !!payload.cctv,
      mezzanine_floor: !!payload.mezzanine_floor,
      parking: !!payload.parking,
      owner_name: payload.owner_name || "",
      owner_contact: payload.owner_contact,
      images: Array.isArray(payload.images) ? payload.images : [],
      status: payload.status || "available",
    });

    return res.status(201).json({ success: true, property });
  } catch (err) {
    console.error("createProperty error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

/**
 * GET /api/properties
 * Supports query filters: city, category, min_builtup, max_builtup, cctv, parking, power_min ...
 * Example: /api/properties?city=Pune&category=factory&min_builtup=10000
 */
export const listProperties = async (req, res) => {
  try {
    const q = req.query;
    const filter = {};

    if (q.city) filter.city = q.city;
    if (q.area) filter.area = q.area;
    if (q.category && q.category !== "none") filter.category = q.category;
    if (q.cctv) filter.cctv = q.cctv === "true";
    if (q.parking) filter.parking = q.parking === "true";
    if (q.power_min) filter.power_kw = { ...(filter.power_kw || {}), $gte: Number(q.power_min) };
    if (q.power_max) filter.power_kw = { ...(filter.power_kw || {}), $lte: Number(q.power_max) };
    if (q.min_builtup) filter.builtup_area = { ...(filter.builtup_area || {}), $gte: Number(q.min_builtup) };
    if (q.max_builtup) filter.builtup_area = { ...(filter.builtup_area || {}), $lte: Number(q.max_builtup) };

    // pagination
    const page = Math.max(1, Number(q.page) || 1);
    const limit = Math.min(100, Number(q.limit) || 20);
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Property.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      meta: { total, page, limit },
      data: properties,
    });
  } catch (err) {
    console.error("listProperties error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * GET /api/properties/:id
 */
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    return res.json({ success: true, property });
  } catch (err) {
    console.error("getPropertyById error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
