const express = require('express');
const connection = require('./conf');

const app = express();
const port = 3000;

// respond to requests on `/api/employees`
app.get('/api/employees', (req, res) => {
  let selectQuery = 'SELECT * FROM employee';
  const queryParams = [];
  const whereClauses = [];
  if (req.query.department) {
    whereClauses.push('department = ?');
    queryParams.push(req.query.department);
  }
  if (req.query.hired_year) {
    whereClauses.push('hired_year = ?');
    queryParams.push(req.query.hired_year);
  }
  // add a WHERE clause to the select query
  if (whereClauses.length > 0) {
    const joinedClauses = whereClauses.join(' AND ');
    selectQuery += ` WHERE ${joinedClauses}`;
  }
  // send an SQL query to get all employees
  connection.query(selectQuery, queryParams, (err, results) => {
    if (err) {
      // If an error has occurred, then the client is informed of the error
      res.status(500).send(`An error occurred: ${err.message}`);
    } else {
      // If everything went well, we send the result of the SQL query as JSON
      res.json(results);
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});
