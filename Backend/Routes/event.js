const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/addevent', (req, res) => {
  console.log("REQUEST BODY IS ", req.body);
  const { event_name, institution, event_date, meal_details,day,no_of_people } = req.body;

  const sqlInsert = `
    INSERT INTO events(event_name, institution, event_date, meal_details,day,no_of_people)
    VALUES (?, ?, ?, ?,?,?)
  `;

  db.query(sqlInsert, [event_name, institution, event_date, JSON.stringify(meal_details),day,no_of_people], (err, result) => {
    if (err) {
      console.error("Error inserting event details:", err);
      res.status(500).send("Error inserting event details");
    } else {
      console.log("Event details inserted successfully:", result);
      res.status(200).send("Event details inserted successfully");
    }
  });
});

router.get('/events', (req, res) => {
  const sqlSelect = "SELECT id, event_name, event_date FROM events";
  
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error("Error fetching event details:", err);
      res.status(500).send("Error fetching event details");
    } else {
      res.status(200).json(result);
    }
  });
});

router.get('/eventdetail', (req, res) => {
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  const sqlSelect = "SELECT * FROM events WHERE id = ?";

  db.query(sqlSelect, [eventId], (err, result) => {
    if (err) {
      console.error("Error fetching event details:", err);
      return res.status(500).send("Error fetching event details");
    }

    // Check if result is empty
    if (result.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(result[0]); // Send the first result object
  });
});

module.exports = router;
