const createTables = async (db) => {
  await db.query(`CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
CREATE TABLE IF NOT EXISTS trips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  destination VARCHAR(255) NOT NULL,
  duration_days INT NOT NULL,
  budget_tier ENUM('Low', 'Medium', 'High') NOT NULL,

  flights_cost DECIMAL(10,2) DEFAULT 0,
  accommodation_cost DECIMAL(10,2) DEFAULT 0,
  food_cost DECIMAL(10,2) DEFAULT 0,
  activities_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,

  status ENUM('Saved', 'Visited') DEFAULT 'Saved',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
)
`);

  await db.query(`
CREATE TABLE IF NOT EXISTS trip_interests (
id INT PRIMARY KEY AUTO_INCREMENT,
trip_id INT NOT NULL,
interest_name VARCHAR(100) NOT NULL,


  FOREIGN KEY (trip_id)
    REFERENCES trips(id)
    ON DELETE CASCADE
)


`);

  await db.query(`
CREATE TABLE IF NOT EXISTS itinerary_days (
id INT PRIMARY KEY AUTO_INCREMENT,
trip_id INT NOT NULL,
day_number INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (trip_id)
    REFERENCES trips(id)
    ON DELETE CASCADE
)


`);

  await db.query(`
CREATE TABLE IF NOT EXISTS activities (
id INT PRIMARY KEY AUTO_INCREMENT,
itinerary_day_id INT NOT NULL,

title VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_cost DECIMAL(10,2) DEFAULT 0,

  time_of_day ENUM(
    'Morning',
    'Afternoon',
    'Evening'
  ),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (itinerary_day_id)
    REFERENCES itinerary_days(id)
    ON DELETE CASCADE
)


`);

  await db.query(`
CREATE TABLE IF NOT EXISTS hotels (
id INT PRIMARY KEY AUTO_INCREMENT,
trip_id INT NOT NULL,


  hotel_name VARCHAR(255) NOT NULL,
  rating DECIMAL(2,1),
  price_per_night DECIMAL(10,2),
  hotel_type VARCHAR(100),

  FOREIGN KEY (trip_id)
    REFERENCES trips(id)
    ON DELETE CASCADE
)


`);

  await db.query(`
CREATE TABLE IF NOT EXISTS packing_items (
id INT PRIMARY KEY AUTO_INCREMENT,
trip_id INT NOT NULL,


  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  is_packed BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (trip_id)
    REFERENCES trips(id)
    ON DELETE CASCADE
)

`);
};

module.exports = createTables;
