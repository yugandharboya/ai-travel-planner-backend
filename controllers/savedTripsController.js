const { getDB } = require("../db/db");

const getSavedTrips = async (req, res) => {
  try {
    const db = getDB();

    const userId = req.user.userId;

    const [savedTrips] = await db.query(
      `
      SELECT *
      FROM trips
      WHERE user_id = ?
      AND status = 'Saved'
      ORDER BY created_at DESC
      `,
      [userId],
    );

    return res.status(200).json(savedTrips);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch saved trips",
    });
  }
};

module.exports = {
  getSavedTrips,
};
