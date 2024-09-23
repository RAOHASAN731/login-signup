const mysql = require("mysql2");

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Default WAMP MySQL user
  password: "", // Default password (usually empty for WAMP)
  database: "my_database", // Your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    return console.error("Error connecting: " + err.stack);
  }
  console.log("Connected as id " + connection.threadId);
});

// Example query
connection.query("SELECT * FROM your_table_name", (error, results) => {
  if (error) throw error;
  console.log(results);
});

// Close the connection
connection.end();
