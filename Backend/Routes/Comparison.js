const express = require('express');
const db = require('../db'); // Ensure this is the correct path to your database configuration
const bodyParser = require('body-parser');

const router = express.Router();

router.get('/report', async (req, res) => {
  const f = req.query.fdate; // Start date in 'YYYY-MM-DD' format
  const t = req.query.tdate; // End date in 'YYYY-MM-DD' format

  try {
    // Extract year and month range from the dates
    const startDate = new Date(f);
    const endDate = new Date(t);
    const months = [];
    const monthColumns = [];

    for (let m = startDate.getMonth(); m <= endDate.getMonth(); m++) {
      const monthName = new Date(startDate.getFullYear(), m).toLocaleString('default', { month: 'long' });
      months.push(monthName);
      monthColumns.push(`
        COALESCE(SUM(CASE WHEN MONTH(p.date) = ${m + 1} THEN p.quantity ELSE 0 END), 0) AS ${monthName}_quantity,
        COALESCE(SUM(CASE WHEN MONTH(p.date) = ${m + 1} THEN p.amount ELSE 0 END), 0) AS ${monthName}_amount
      `);
    }

    // Join month columns to create dynamic SQL
    const sqlQuery = `
      SELECT
        p.item AS item_name,
        ${monthColumns.join(',\n')}
      FROM purchase p
      WHERE p.date BETWEEN ? AND ?
      GROUP BY p.item;
    `;

    const [rows] = await db.promise().query(sqlQuery, [f, t]);

    res.status(200).send(rows);
    console.log(rows);
  } catch (err) {
    console.error("Error fetching report data:", err);
    res.status(500).send({ error: 'An error occurred while fetching report data' });
  }
});

module.exports = router;
