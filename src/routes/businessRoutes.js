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
  fetchBusiness,
  changeBusinessStatus,
} from "../controller/businessController.js";
// import { upload } from "../middleware/upload.js";
import { upload } from "../middleware/cloudinaryUpload.js";

const router = express.Router();

//ADMIN
router.get("/business", fetchBusiness);
router.put("/business/:id/status", changeBusinessStatus);

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
