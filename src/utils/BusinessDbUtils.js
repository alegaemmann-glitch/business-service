import { pool } from "../config/db.js";
import chalk from "chalk";

const businessTableQuery = `
  CREATE TABLE IF NOT EXISTS business (
    id INT AUTO_INCREMENT PRIMARY KEY,
    businessName VARCHAR(100) NOT NULL,
    ownerFullName VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    businessType VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    logo VARCHAR(255),
    userId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    latitude DOUBLE,
    longitude DOUBLE,
    categories JSON NULL,
    isOpen BOOLEAN DEFAULT FALSE
  )
`;

const menuTableQuery = `
  CREATE TABLE IF NOT EXISTS menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    businessId INT NOT NULL,
    businessName VARCHAR(100) NOT NULL,
    productName VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (businessId) REFERENCES business(id) ON DELETE CASCADE
  )
`;

const cuisineCategoryTableQuery = `
  CREATE TABLE IF NOT EXISTS cuisine_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoryType VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL
  )
`;

// Create individual table
const createTable = async (tableName, query) => {
  try {
    await pool.query(query);
    console.log(
      chalk.cyan(`${tableName} table is ready (created if not exists).`)
    );
  } catch (error) {
    console.log(chalk.red(`Error creating ${tableName} table:`, error));
    throw error;
  }
};

// Create all tables
const createAllTable = async () => {
  try {
    await createTable("business", businessTableQuery);
    await createTable("menu", menuTableQuery); // add this line
    await createTable("cuisine_category", cuisineCategoryTableQuery);
  } catch (error) {
    console.log(chalk.red("Error setting up tables."), error);
    throw error;
  }
};

export default createAllTable;
