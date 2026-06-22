const { getDB } = require("../db/db");

const getTripDetails = async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.userId;
    const { tripId } = req.params;

    // Trip details
    const [trip] = await db.query(
      `
      SELECT *
      FROM trips
      WHERE id = ? AND user_id=?
      `,
      [tripId, userId],
    );

    if (trip.length === 0) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // Interests
    const [interests] = await db.query(
      `
      SELECT *
      FROM trip_interests
      WHERE trip_id = ?
      `,
      [tripId],
    );

    // Hotels
    const [hotels] = await db.query(
      `
      SELECT *
      FROM hotels
      WHERE trip_id = ?
      `,
      [tripId],
    );

    // Packing items
    const [packing] = await db.query(
      `
      SELECT *
      FROM packing_items
      WHERE trip_id = ?
      `,
      [tripId],
    );

    // Itinerary days
    const [days] = await db.query(
      `
      SELECT *
      FROM itinerary_days
      WHERE trip_id = ?
      ORDER BY day_number
      `,
      [tripId],
    );

    // Activities for each day
    const itinerary = [];

    for (const day of days) {
      const [activities] = await db.query(
        `
        SELECT *
        FROM activities
        WHERE itinerary_day_id = ?
        `,
        [day.id],
      );

      itinerary.push({
        day: day.day_number,
        activities,
      });
    }

    return res.status(200).json({
      trip: trip[0],
      interests,
      hotels,
      packing,
      itinerary,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch trip details",
    });
  }
};

module.exports = { getTripDetails };
