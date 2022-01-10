const mysql = require('mysql');
const inquirer = require('inquirer')
const schema = require('./schema.sql')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'whippersnapper3'
})

connection.connect((err) => {
    if (err) throw err;
    connection.query("CREATE DATABASE employee_db", function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });
  });