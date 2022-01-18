const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const { choices } = require('yargs');
const { listenerCount } = require('process');


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
connection.query = util.promisify(connection.query)
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
            case 'Add role':
                addRole();
                break;
            case 'Add employee':
                addEmployee();
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

async function addRole() {
    connection.query('SELECT * from department', (err, res) => {
    inquirer.prompt([
        {
        name: 'roleTitle',
        type: 'input',
        message: 'What is the title of the new role?'
        },
        {
        name: 'roleSalary',
        type: 'input',
        message: "What is the role's salary?"
        },
        {
        name: 'roleDepartment',
        message: 'Which department does the role belong to?',
        type: 'list',
        choices() {
            if (err) throw err;
            const deptList = []
            res.forEach(({ name, id }) => {
                deptList.push({name: name, value: id})
            })
            return deptList
            }
        }
    ]).then((answer) => {
        connection.query('INSERT INTO employee_role SET ?', {
            title: answer.roleTitle,
            salary: answer.roleSalary,
            department_id: answer.roleDepartment
        }, (err) => {
            if (err) throw err;
            console.log('Role added successfully!')
            mainMenu()
        })
    })
    }
)}

function addEmployee() {
    connection.query('SELECT * from employee_role', (err, res) => {
    inquirer.prompt([
        {
            name: 'employeeFirstName',
            type: 'input',
            message: "What is the employee's first name?"
        },
        {
            name: 'employeeLastName',
            type: 'input',
            message: "What is the employee's last name?"
        },
        {
            name: 'employeeRole',
            type: 'list',
            message: "What is the employee's role?",
            choices() {
                if (err) throw err;
                const roleList = []
                res.forEach(({ title }) => {
                    roleList.push(title)
                })
                return roleList;
                }
        },
        ]).then((answer) => {
            let managerID;
            if (answer.employeeRole !== 'Manager') {
                inquirer.prompt([
                    {
                        name: 'employeeManager',
                        type: 'list'
                    }
                ])
            } else {
                connection.query('INSERT INTO employee SET ?', {
                    first_name: answer.employeeFirstName,
                    last_name: answer.employeeLastName,
                    
                })
            }
        })
    })
}