import express from "express";
import {
  registerRestaurant,
  fetchUserBusiness,
  updateBusinessLogo,
  createMenuItem,
  fetchMenuItemsByBusiness,
  toggleBusinessOpenState,
  fetchRecommendedRestaurants,
  fetchAllRestaurants,
  fetchBusinessLocations,
} from "../controller/businessController.js";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { pool } from "../config/db.js";

const router = express.Router();

router.get("/all-restaurants", fetchAllRestaurants);
router.get("/locations", fetchBusinessLocations);

router.post("/add", registerRestaurant);
router.get("/:userId", fetchUserBusiness);
router.put("/logo/:userId", upload.single("logo"), updateBusinessLogo);
router.post("/menu/add-items", upload.single("productImage"), createMenuItem);
router.get("/menu-items/:businessId", fetchMenuItemsByBusiness);
router.put("/:id/open", toggleBusinessOpenState);

router.get("/recommended/:userId", fetchRecommendedRestaurants);

export default router;
