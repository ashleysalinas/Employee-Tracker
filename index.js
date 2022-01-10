const mysql = require('mysql');
const inquirer = require('inquirer');
const { bigIntLiteral } = require('@babel/types');
//const schema = require('./schema.sql')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'whippersnapper3',
    database: 'employees_db',
})

connection.connect((err) => {
    connection.query(
    "CREATE DATABASE employee_db", function (err, result) {
        if (err) throw err;
        console.log("Database created");
        mainMenu()
      });
  });

function mainMenu() {
    inquirer.prompt({
        name: 'mainMenu',
        type: 'list',
        message: "Please choose from the following",
        choices: [
            'Add department',
            'Add role',
            'Add employee',
            'View departments',
            'View roles',
            'View employees',
            'Update employee roles',
            'Update employee by manager',
            'View employees by manager',
            'Delete department',
            'Delete role',
            'Delete employee',
            'View department budget (based on salary)'
    ]
        }).then((answer) => {
            switch(answer.mainMenu) {
                case 'Add department':
                addDepartment();
                break;
                case 'Add role':
                console.log("its working");
                break;
            }
        })
}

function addDepartment() {
    inquirer.prompt({
        name: 'addDeparmentName',
        type: 'input',
        message: 'What is the name of the department you would like to add?'
    }).then((answer) => {
    connection.query('INSERT INTO department SET ?', {
        id: '',
        name: answer.addDeparmentName
    }, (err) => {
        if (err) throw err;
        console.log('Your auction was created successfully!');
        // re-prompt the user for if they want to bid or post
        mainMenu()})
    })
}