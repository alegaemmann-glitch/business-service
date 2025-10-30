// controllers/restaurantController.js
import { pool } from "../config/db.js";
import {
  createRestaurant,
  getRestaurantByEmail,
  getBusinessByUserId,
  addProductToMenu,
  getProductsByBusinessId,
  updateBusinessOpenState,
  getRecommendedRestaurants,
  getAllRestaurants,
  getBusinessLocations,
  getAllBusinesses,
  updateBusinessStatus,
} from "../../src/model/businessModel.js";
import dotenv from "dotenv";

dotenv.config();

const businessServiceBaseURL =
  process.env.BUSINESS_SERVICE_URL || "http://localhost:3003";

export const registerRestaurant = async (req, res) => {
  try {
    const {
      businessName,
      fullName,
      email,
      businessType,
      phone,
      address,
      latitude,
      longitude,
      userId,
      logo,
      categories, // Add this
    } = req.body;

    // Validate all required fields
    if (
      !businessName ||
      !fullName ||
      !email ||
      !businessType ||
      !phone ||
      !address ||
      !latitude ||
      !longitude ||
      !userId
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for duplicate email
    const existingRestaurant = await getRestaurantByEmail(email);
    if (existingRestaurant) {
      return res.status(409).json({ message: "Email already exists." });
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Categories are required." });
    }

    const categoriesStr = JSON.stringify(categories); // Store as stringified JSON

    // Create the restaurant
    const restaurant = await createRestaurant({
      name: businessName,
      ownerFullName: fullName,
      email,
      businessType,
      phone,
      address,
      latitude,
      longitude,
      logo,
      userId,
      categories: categoriesStr, // send stringified version
    });

    res
      .status(201)
      .json({ message: "Restaurant registered.", id: restaurant.id });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const fetchUserBusiness = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const business = await getBusinessByUserId(userId);

    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    if (business.categories && typeof business.categories === "string") {
      try {
        business.categories = JSON.parse(business.categories);
      } catch (err) {
        business.categories = [];
      }
    }

    res.status(200).json(business);
  } catch (error) {
    console.error("Error fetching business:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const updateBusinessLogo = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Cloudinary provides the full URL in req.file.path
    const logoPath = req.file?.path || null;

    if (!logoPath) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    await pool.query("UPDATE business SET logo = ? WHERE userId = ?", [
      logoPath,
      userId,
    ]);

    res.status(200).json({
      message: "Logo updated successfully.",
      logo: logoPath,
    });
  } catch (error) {
    console.error("Error updating logo:", error);
    res.status(500).json({ message: "Server error while updating logo." });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { userId, category, productName, price, description } = req.body;

    if (!userId || !category || !productName || !price) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const business = await getBusinessByUserId(userId);
    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    // Cloudinary provides the full URL in req.file.path
    const image = req.file?.path || null;

    const newProductId = await addProductToMenu({
      category,
      businessId: business.id,
      businessName: business.businessName,
      productName,
      price,
      description,
      image,
    });

    res.status(201).json({
      message: "Product added successfully.",
      id: newProductId,
      image: image,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const fetchMenuItemsByBusiness = async (req, res) => {
  try {
    const businessId = req.params.businessId;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required." });
    }

    const items = await getProductsByBusinessId(businessId);

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const toggleBusinessOpenState = async (req, res) => {
  const { id } = req.params;
  const { isOpen } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE business SET isOpen = ? WHERE id = ?",
      [isOpen, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Business not found." });
    }

    res.status(200).json({ message: "Business open state updated." });
  } catch (error) {
    console.error("Error updating business open state:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const fetchRecommendedRestaurants = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch user preferences via HTTP from user-service
    const userServiceUrl =
      process.env.USER_SERVICE_URL || "http://localhost:3002"; // Default to localhost:3003
    const response = await fetch(
      `${userServiceUrl}/api/user/preferences/${userId}`
    );

    if (!response.ok) {
      console.log(
        "User-service unavailable or error. Fetching fallback recommendations."
      );
      const recommendedRestaurants = await getRecommendedRestaurants([]);
      return res.status(200).json(recommendedRestaurants);
    }

    const data = await response.json();
    if (!data.categories) {
      console.log("No preferences found. Fetching fallback recommendations.");
      const recommendedRestaurants = await getRecommendedRestaurants([]);
      return res.status(200).json(recommendedRestaurants);
    }

    const preferencesRaw = String(data.categories || "");
    const preferences = preferencesRaw
      .split(",")
      .map((cat) => cat.trim())
      .filter(Boolean);

    const recommendedRestaurants = await getRecommendedRestaurants(preferences);
    return res.status(200).json(recommendedRestaurants);
  } catch (error) {
    console.error("Error fetching recommended restaurants:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const fetchAllRestaurants = async (req, res) => {
  try {
    const restaurants = await getAllRestaurants();
    return res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const fetchBusinessLocations = async (req, res) => {
  try {
    const locations = await fetchLocations();
    res.json(locations);
  } catch (err) {
    console.error("Error fetching business locations:", err);
    res.status(500).json({ error: "Failed to get business locations" });
  }
};

//ADMIN

export const fetchBusiness = async (req, res) => {
  try {
    const businesses = await getAllBusinesses();

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ message: "No businesses found." });
    }

    // Parse categories if needed
    const parsedBusinesses = businesses.map((b) => {
      if (b.categories && typeof b.categories === "string") {
        try {
          b.categories = JSON.parse(b.categories);
        } catch {
          b.categories = [];
        }
      }
      return b;
    });

    res.status(200).json(parsedBusinesses); // ✅ Return array
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const changeBusinessStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "approved", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    await updateBusinessStatus(id, status);
    res.status(200).json({ message: "Business status updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
