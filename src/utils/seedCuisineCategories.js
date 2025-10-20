import chalk from "chalk";
import { pool } from "../config/db.js";

const seedCuisineCategories = async () => {
  const categories = [
    // Cuisines
    ["Cuisines", "American"],
    ["Cuisines", "Asian"],
    ["Cuisines", "Chinese"],
    ["Cuisines", "Filipino"],
    ["Cuisines", "Indian"],
    ["Cuisines", "Italian"],
    ["Cuisines", "Japanese"],
    ["Cuisines", "Korean"],
    ["Cuisines", "Middle Eastern"],
    ["Cuisines", "Thai"],
    ["Cuisines", "Western"],

    // Main Dishes
    ["Main Dishes", "BBQ"],
    ["Main Dishes", "Biryani"],
    ["Main Dishes", "Bulalo"],
    ["Main Dishes", "Burgers"],
    ["Main Dishes", "Chicken"],
    ["Main Dishes", "Chicken Wings"],
    ["Main Dishes", "Curry"],
    ["Main Dishes", "Dim Sum"],
    ["Main Dishes", "Dumpling"],
    ["Main Dishes", "Fried Chicken"],
    ["Main Dishes", "Halo-Halo"],
    ["Main Dishes", "Kare Kare"],
    ["Main Dishes", "Lechon"],
    ["Main Dishes", "Liempo"],
    ["Main Dishes", "Lomi"],
    ["Main Dishes", "Noodles"],
    ["Main Dishes", "Pancit"],
    ["Main Dishes", "Pares"],
    ["Main Dishes", "Pasta"],
    ["Main Dishes", "Pizza"],
    ["Main Dishes", "Rice Bowl"],
    ["Main Dishes", "Rice Dishes"],
    ["Main Dishes", "Rice Noodles"],
    ["Main Dishes", "Sinigang"],
    ["Main Dishes", "Sisig"],
    ["Main Dishes", "Ulam"],

    // Snacks & Sides
    ["Snacks & Sides", "Bread"],
    ["Snacks & Sides", "Corndogs"],
    ["Snacks & Sides", "Fries"],
    ["Snacks & Sides", "Fruit Shake"],
    ["Snacks & Sides", "Ice Cream"],
    ["Snacks & Sides", "Milk Tea"],
    ["Snacks & Sides", "Salads"],
    ["Snacks & Sides", "Sandwiches"],
    ["Snacks & Sides", "Seafood"],
    ["Snacks & Sides", "Shawarma"],
    ["Snacks & Sides", "Silog"],
    ["Snacks & Sides", "Snacks"],
    ["Snacks & Sides", "Soups"],
    ["Snacks & Sides", "Takoyaki"],
    ["Snacks & Sides", "Wraps"],

    // Desserts
    ["Desserts", "Cakes"],
    ["Desserts", "Desserts"],
    ["Desserts", "Donut"],
    ["Desserts", "Fast Food"],

    // Beverages
    ["Beverages", "Beverages"],
    ["Beverages", "Coffee"],
    ["Beverages", "Fruit Shake"],
    ["Beverages", "Milk Tea"],

    // Fast Food
    ["Fast Food", "Fast Food"],
    ["Fast Food", "Burgers"],
    ["Fast Food", "Corndogs"],
    ["Fast Food", "Fries"],
  ];

  try {
    const values = categories.map(([type, name]) => [type, name]);
    await pool.query(
      "INSERT INTO cuisine_category (categoryType, name) VALUES ?",
      [values]
    );
    console.log(chalk.green("Cuisine categories seeded successfully."));
  } catch (error) {
    console.log(chalk.red("Failed to seed cuisine categories:"), error);
  }
};

export default seedCuisineCategories;
