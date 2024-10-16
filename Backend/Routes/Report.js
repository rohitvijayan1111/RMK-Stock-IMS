const express = require('express');
const db = require('../db'); // Assuming your database connection is set up in db.js
const router = express.Router();

// Route to fetch dispatch report between two dates
router.get('/dispatchReport', async (req, res) => {
  try {
    // Get the start and end dates from the query parameters
    const { startDate, endDate } = req.query;

    // Query to fetch dispatch data between the specified dates (inclusive)
    const query = `
      SELECT 
        dispatch_id,
        purchase_id,
        quantity,
        location,
        receiver,
        incharge,
        dispatch_date
      FROM dispatch
      WHERE dispatch_date BETWEEN ? AND ?
      ORDER BY dispatch_date ASC;
    `;

    // Execute the query with the provided dates
    const [rows] = await db.promise().query(query, [startDate, endDate]);

    // Send the data as a response
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching dispatch report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dispatch report'
    });
  }
});
router.get('/purchaseReport', async (req, res) => {
    try {
      // Get the start and end dates from the query parameters
      const { startDate, endDate } = req.query;
  
      // Query to fetch purchase data between the specified dates (inclusive)
      const query = `
        SELECT 
          purchase_id,
          item_id,
          quantity,
          invoice_no,
          amount,
          shop_address,
          purchase_date,
          expiry_date
        FROM purchases
        WHERE purchase_date BETWEEN ? AND ?
        ORDER BY purchase_date ASC;
      `;
  
      // Execute the query with the provided dates
      const [rows] = await db.promise().query(query, [startDate, endDate]);
  
      // Send the data as a response
      res.json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching purchase report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch purchase report'
      });
    }
  });
module.exports = router;
