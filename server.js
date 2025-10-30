import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chalk from "chalk";
import { checkConnections } from "./src/config/db.js";
import createAllTable from "./src/utils/BusinessDbUtils.js";
import businessRoutes from "./src/routes/businessRoutes.js";
// import seedCuisineCategories from "./src/utils/seedCuisineCategories.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.BUSINESS_PORT || 3003;

app.use("/api/business", businessRoutes);

// app.use("/uploads", express.static("uploads"));

app.listen(PORT, async () => {
  console.log(chalk.green(`Business Server running on port ${PORT}`));

  try {
    await checkConnections();
    await createAllTable();
    // await seedCuisineCategories(); // 👈 Add this
  } catch (error) {
    console.log(
      chalk.red("Failed to initialize Business-Service Database"),
      error
    );
  }
});
