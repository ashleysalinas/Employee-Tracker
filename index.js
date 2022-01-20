const mysql = require('mysql');
const inquirer = require('inquirer');
const util = require('util');
const { listenerCount, title } = require('process');
const { func } = require('prop-types');


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
            'Update employee role',
            'Quit'
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
            case 'View departments':
                viewDepartments();
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Update employee role':
                updateEmployee();
                break;
            case 'Quit':
                quit();
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
                res.forEach(({ title, id }) => {
                    roleList.push({name: title, value: id})
                })
                return roleList;
                }
        },
        ]).then((answer) => {
            let employeeFN = answer.employeeFirstName;
            let employeeLN = answer.employeeLastName;
            let employeeRI = answer.employeeRole
            console.log(employeeFN)
            if (answer.employeeRole == 9) {
                connection.query('INSERT INTO employee SET ?', {
                    first_name: employeeFN,
                    last_name: employeeLN,
                    role_id: employeeRI,
                })
                console.log('Employee added successfully!');
                mainMenu();
            } else {
                connection.query('SELECT * FROM employee WHERE role_id = "9"', (err, res) => {
                    inquirer.prompt({
                        name: 'employeeManager',
                        type: 'list',
                        message: "Who is the employee's manager?",
                        choices() {
                            const managerList = [];
                            res.forEach(({ first_name, last_name, id }) => {
                                managerList.push({name: first_name + " " + last_name, value: id})
                            })
                            return managerList;
                        }
                    }).then((answer) => {
                        connection.query('INSERT INTO employee SET ?', {
                            first_name: employeeFN,
                            last_name: employeeLN,
                            role_id: employeeRI,
                            manager_id:answer.employeeManager,
                        }
                        )
                        console.log("Employee added successfully!")
                        mainMenu() 
                    }
                    )
                })
            }
        })
    })
}

async function viewDepartments() {
    connection.query('SELECT * from department', (err,row) => {
        if (err) throw err;
      console.table(row)
      mainMenu()
    });
}

function viewRoles() {
    connection.query('SELECT title, salary, department_id, department.name as dept_name from employee_role inner join department on employee_role.department_id=department.id', (err,row) => {
        if (err) throw err;
      console.table(row)
      mainMenu()
    });
}

function viewEmployees() {
    connection.query('Select first_name, last_name, role_id as role, manager_id as manager,employee_role.title as role from employee inner join employee_role on employee.role_id=employee_role.id', (err, row) => {
        console.table(row)
        mainMenu()
    })
}

function updateEmployee() {
    connection.query('SELECT * from employee', (err, res) => {
    inquirer.prompt(
        {
        name: 'whichEmployee',
        message: "Which employee would you like to update?",
        type: "list",
        choices() {
            const employeeList = [];
            res.forEach(({ first_name, last_name, id}) => {
                employeeList.push({ name: first_name + " " + last_name, value: id})
            })
            return employeeList;
            }
        },
    ).then((answer) => {
        let employeeID = answer.whichEmployee;
        connection.query('SELECT * from employee_role', (err,res) => {
            inquirer.prompt({
                name: 'whichRole',
                message: "Which of the following is the employee's new role?",
                type: 'list',
                choices() {
                    const roleList = []
                    res.forEach(({ title, id }) => {
                        roleList.push({ name: title, value: id})
                    })
                    return roleList
                }
            }
            ).then((answer) => {
                connection.query(`UPDATE employee SET role_id = ${answer.whichRole} WHERE id = ${employeeID}`, (err) => {
                    if (err) throw err;
                    console.log('Employee status updated!')
                    mainMenu();
                });
        });
    });
    });
    })
}

function quit() {
    console.log('Goodbye!')
    process.exit(1)
}