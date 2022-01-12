const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'whippersnapper3' // change with .env
});

connection.connect((err) => {
    if (err) throw err;
    console.log('working')
})
