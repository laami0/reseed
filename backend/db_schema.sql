DROP DATABASE IF EXISTS reseed;

CREATE DATABASE IF NOT EXISTS reseed;

USE reseed;

CREATE TABLE IF NOT EXISTS users (
  user_number INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
  address_number INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  addition VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  plz INT NOT NULL,
  street VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  order_number INT AUTO_INCREMENT PRIMARY KEY,
  user_number INT NOT NULL,
  FOREIGN KEY (user_number) REFERENCES users(user_number),
  address_number INT NOT NULL,
  FOREIGN KEY (address_number) REFERENCES addresses(address_number),
  delivery_type varchar(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  category_number INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS seeds (
  seed_number INT AUTO_INCREMENT PRIMARY KEY,
  dt_name VARCHAR(255) NOT NULL,
  lt_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  stock INT NOT NULL,
  water VARCHAR(255) NOT NULL,
  plant_time VARCHAR(255) NOT NULL,
  climate VARCHAR(255) NOT NULL,
  sun BOOLEAN NOT NULL,
  growth_weeks INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seed_categories (
  seed_number INT,
  category_number INT,
  PRIMARY KEY (seed_number, category_number),
  FOREIGN KEY (seed_number) REFERENCES seeds(seed_number),
  FOREIGN KEY (category_number) REFERENCES categories(category_number)
);

CREATE TABLE IF NOT EXISTS order_positions (
  position_number INT AUTO_INCREMENT PRIMARY KEY,
  order_number INT NOT NULL,
  FOREIGN KEY (order_number) REFERENCES orders(order_number),
  seed_number INT NOT NULL,
  FOREIGN KEY (seed_number) REFERENCES seeds(seed_number),
  amount INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rents (
  rent_number INT AUTO_INCREMENT PRIMARY KEY,
  order_number INT NOT NULL,
  FOREIGN KEY (order_number) REFERENCES orders(order_number),
  seed_number INT NOT NULL,
  FOREIGN KEY (seed_number) REFERENCES seeds(seed_number),
  user_number INT NOT NULL,
  FOREIGN KEY (user_number) REFERENCES users(user_number),
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);