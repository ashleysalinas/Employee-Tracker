const mysql = require('mysql');
const inquirer = require('inquirer')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'whippersnapper3',
    database: 'employees_db' // change with .env
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Welcome to the Employee Tracker app!')
    mainMenu()
})

function mainMenu() {
    inquirer.prompt({
        name: 'mainmenu',
        type: 'list',
        message: 'Please choose from the following options',
        choices: [
            'Add department',
            'Add role',
            'Add employee',
            'View departments',
            'View roles',
            'View all employees',
            'Update employee role'
        ]
    }).then((answer) => {
        switch (answer.mainmenu) {
            case 'Add department':
                addDepartment()
                break;
        }
    })
}

function addDepartment() {
    inquirer.prompt({
        name: 'deparmentName',
        type: 'input',
        message: 'What is the name of the department you would like to add?'
    }).then((answer) => {
        connection.query('INSERT into department SET ?', {
            name: answer.deparmentName
        }, (err) => {
            if (err) throw err;
            console.log('Department added successfully!')
            mainMenu()
        }) 
    })
}