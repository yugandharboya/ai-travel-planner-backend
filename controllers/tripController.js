const { getDB } = require("../db/db");

const saveTrip = async (req, res) => {
  try {
    const db = getDB();

    const { destination, durationDays, budgetTier, interests, tripPlan } =
      req.body;

    const userId = req.user.userId;

    // 1. Save trip
    const [tripResult] = await db.query(
      `
      INSERT INTO trips (
        user_id,
        destination,
        duration_days,
        budget_tier,
        flights_cost,
        accommodation_cost,
        food_cost,
        activities_cost,
        total_cost
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        destination,
        durationDays,
        budgetTier,
        tripPlan.budget.flights,
        tripPlan.budget.accommodation,
        tripPlan.budget.food,
        tripPlan.budget.activities,
        tripPlan.budget.total,
      ],
    );

    const tripId = tripResult.insertId;

    // 2. Save interests
    for (const interest of interests) {
      await db.query(
        `
        INSERT INTO trip_interests (
          trip_id,
          interest_name
        )
        VALUES (?, ?)
        `,
        [tripId, interest],
      );
    }

    // 3. Save hotels
    for (const hotel of tripPlan.hotels) {
      await db.query(
        `
        INSERT INTO hotels (
          trip_id,
          hotel_name,
          rating,
          price_per_night,
          hotel_type
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          tripId,
          hotel.hotel_name,
          hotel.rating,
          hotel.price_per_night,
          hotel.hotel_type,
        ],
      );
    }

    // 4. Save packing items
    for (const item of tripPlan.packing) {
      await db.query(
        `
        INSERT INTO packing_items (
          trip_id,
          item_name,
          category
        )
        VALUES (?, ?, ?)
        `,
        [tripId, item.item_name, item.category],
      );
    }

    // 5 & 6. Save itinerary days and activities
    for (const day of tripPlan.itinerary) {
      const [dayResult] = await db.query(
        `
        INSERT INTO itinerary_days (
          trip_id,
          day_number
        )
        VALUES (?, ?)
        `,
        [tripId, day.day],
      );

      const dayId = dayResult.insertId;

      for (const activity of day.activities) {
        await db.query(
          `
          INSERT INTO activities (
            itinerary_day_id,
            title,
            description,
            estimated_cost,
            time_of_day
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            dayId,
            activity.title,
            activity.description,
            activity.estimated_cost,
            activity.time_of_day,
          ],
        );
      }
    }

    return res.status(201).json({
      message: "Trip saved successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to save trip",
    });
  }
};

module.exports = {
  saveTrip,
};
