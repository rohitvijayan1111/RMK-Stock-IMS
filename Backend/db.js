const mysql = require('mysql2/promise'); 


const db = mysql.createPool({
  host: 'localhost',     
  user: 'root',        
  password: 'pass123',  
  database: 'inventory'  
});

module.exports = db;
