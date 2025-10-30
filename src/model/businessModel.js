import { pool } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const businessServiceBaseURL =
  process.env.BUSINESS_SERVICE_URL || "http://localhost:3003";
const DEFAULT_LOGO_URL = `${businessServiceBaseURL}/uploads/logo/default-business-logo.png`;

export const createRestaurant = async ({
  name,
  ownerFullName,
  address,
  email,
  businessType,
  phone,
  logo = DEFAULT_LOGO_URL,
  userId,
  latitude,
  longitude,
  categories,
}) => {
  const [result] = await pool.query(
    `INSERT INTO business 
      (businessName, ownerFullName, address, email, businessType, phone, logo, userId, latitude, longitude, categories) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      ownerFullName,
      address,
      email,
      businessType,
      phone,
      logo,
      userId,
      latitude,
      longitude,
      categories,
    ]
  );
  return { id: result.insertId };
};

export const getRestaurantByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM business WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

export const getBusinessByUserId = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM business WHERE userId = ? LIMIT 1",
    [userId]
  );
  return rows[0];
};

export const addProductToMenu = async ({
  category,
  businessId,
  businessName,
  productName,
  price,
  description,
  image,
}) => {
  const [result] = await pool.query(
    `INSERT INTO menu 
      (category, businessId, businessName, productName, price, description, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [category, businessId, businessName, productName, price, description, image]
  );
  return result.insertId;
};

export const getProductsByBusinessId = async (businessId) => {
  const [rows] = await pool.query(
    `SELECT id, category, productName, price, description, image 
     FROM menu 
     WHERE businessId = ?`,
    [businessId]
  );
  return rows;
};

export const updateBusinessOpenState = (businessId, isOpen) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE business SET isOpen = ? WHERE id = ?";
    pool.query(query, [isOpen, businessId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const getRecommendedRestaurants = async (userCategories) => {
  const [rows] = await pool.query(`SELECT * FROM business`);

  const parsedRestaurants = rows.map((restaurant) => {
    return {
      ...restaurant,
      categories: Array.isArray(restaurant.categories)
        ? restaurant.categories
        : [],
    };
  });

  if (!userCategories || userCategories.length === 0) {
    console.log(
      "No user categories found. Returning default top 10 restaurants."
    );
    return parsedRestaurants.slice(0, 10); // fallback: return first 10 or based on some ranking
  }

  const scoredRestaurants = parsedRestaurants.map((restaurant) => {
    const matchCount = restaurant.categories.filter((cat) =>
      userCategories.includes(cat)
    ).length;

    return {
      ...restaurant,
      matchScore: matchCount,
    };
  });

  return scoredRestaurants
    .filter((r) => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};

export const getAllRestaurants = async () => {
  try {
    const [rows] = await pool.query(`SELECT * FROM business`);
    // console.log("Fetched rows:", rows); // 👈 Add this to show all restaurants list in the console for debug
    return rows.map((restaurant) => ({
      ...restaurant,
      categories: Array.isArray(restaurant.categories)
        ? restaurant.categories
        : [],
    }));
  } catch (error) {
    console.error("Error in getAllRestaurants:", error); // 👈 Add this
    throw error;
  }
};

export const getBusinessLocations = async () => {
  const [rows] = await pool.query(
    `SELECT id, businessName, latitude, longitude, address FROM business`
  );
  return rows;
};

//ADMIN

export const getAllBusinesses = async () => {
  const [rows] = await pool.query("SELECT * FROM business");
  return rows; // ✅ Always an array
};

export const updateBusinessStatus = (businessId, newStatus) => {
  return new Promise((resolve, reject) => {
    const query = "UPDATE business SET status = ? WHERE id = ?";
    pool.query(query, [newStatus, businessId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
