const mysql = require('mysql2');

var connection = mysql.createConnection({
    host: 'localhost',
    Port : 3001,
    user : 'root',
    password : 'password',
    database : 'employee_db'
});

