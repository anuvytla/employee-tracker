const mysql = require('mysql2');
const inquirer = require('inquirer');
const util = require('util');
const figlet = require('figlet');
const console_table = require('console.table');

// Connect to employee_db on the local server.
var connection = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password : 'password',
    database : 'employee_db'
});
connection.connect(err => {
    if (err) throw err;
    // Show the management options on successfully connecting to the DB.
    showManagementOptions();
});

// Convert DB query in to a promise.
connection.query = util.promisify(connection.query);

// Present user input and shows the results.
const showManagementOptions = async() => {
    try {
        let answer = await inquirer.prompt({
            name : 'action',
            type: 'list',
            message : 'what would you like to do?',
            choices : [
                'View Employees',
                'View Departments',
                'View Roles',
                'Add Employees',
                'Add Departments',
                'Add Roles',
                'Update Employee Role'
            ]
        });
        // Call appropriate action based on the selected option.
        switch(answer.action) {
            case 'View Employees':
                viewAllEmployees();
                break;
    
            case 'View Departments':
                viewAllDepartments();
                break;
    
            case 'View Roles':
                viewAllRoles();
                break;
    
            case 'Add Employees':
                addEmployees();
                break;
    
            case 'Add Departments':
                addDepartments();
                break;
    
            case 'Add Roles':
                addRoles();
                break;
    
            case 'Update Employee Role':
                updateEmployee();
                break;
        }
    }
     catch (err) {
        console.log(err);
    };
}

// Query all employees and print the results to console.
const viewAllEmployees = async() => {
    try {
        // Select everything from employee table.
        let query = 'SELECT * FROM employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            // Print the results in table format.
            console.table(res);
            // Present user input again
            showManagementOptions();
        });
    } catch (err) {
        console.log(err);
    };
}

// Query all departments and print the results to console.
const viewAllDepartments = async() => {
    try {
        // Select everything from department table.
        let query ='SELECT * FROM department';
        connection.query(query, function(err, res){
            if (err) throw err;
            // Print the results in table format.
            console.table(res);
            // Present user input again
            showManagementOptions();
        });
    } catch (err) {
        console.log(err);
    };
}

// Query all roles and print the results to console.
const viewAllRoles = async() => {
    try {
        // Select everything from role table.
        let query = 'SELECT * FROM role';
        connection.query(query, function (err,res) {
            if (err) throw err;
            // Print the results in table format.
            console.table(res);
            // Present user input again
            showManagementOptions();
        });
    } catch (err) {
        console.log(err);
    };
}

// Gathers employee details and add it to the database.
const addEmployees = async() => {
    try {
        // Get all roles and managers to present as an option 
        let roles = await connection.query("SELECT * FROM role");
        let managers = await connection.query("SELECT * FROM employee");

        // Inquirer prompts to gather new employee details
        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the first name of this Employee?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the last name of this Employee?'
            },
            {
                name: 'employeeRoleId',
                type: 'list',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
                message: "What is this Employee's role id?"
            },
            {
                name: 'employeeManagerId',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: "What is this Employee's Manager's Id?"
            }
        ])

        // Insert new employee details in to the DB
        let result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });
        // Print success message to the user.
        console.log(`${answer.firstName} ${answer.lastName} added successfully.\n`);
        // Present user input again
        showManagementOptions();

    } catch (err) {
        console.log(err);
    };
}

// Take in department name and add it to the database.
const addDepartments = async() => {
    try {
        // Inquirer prompt to get name of the new department.
        let userinput = await inquirer.prompt([
            {
                name:'departmentName',
                type:'input',
                message: 'What is the name of th employees department?'

            }
        ]);
        // Insert the new department in to the DB.
        let result = await connection.query("INSERT INTO department SET ?", {
            department_name: userinput.departmentName
        });
        console.log(`${userinput.departmentName} added successfully to departments.\n`);
        // Present user input again
        showManagementOptions();
    }catch (err) {
        console.log(err);
    };
}

// Takes in Role title and salary from user and adds it to the DB.
const addRoles = async() => {
    try {
        // Get all departments to present as an input option.
        let departments = await connection.query('SELECT * FROM department');
        // Inquirer prompt to get details of the new role.
        let answer = await inquirer.prompt ([
            {
                name : 'title',
                type : 'input',
                message : 'what is the name of the employees new role?'
            },
            {
                name: 'salary',
                type : 'input',
                message : 'what is the salary of the new employee?'
            },
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map((departmentId) => {
                    return {
                        name: departmentId.department_name,
                        value: departmentId.id
                    }
                }),
                message: 'What department ID is this role associated with?',
            }
        ]);
        let chosenDepartment;
        for (i = 0; i < departments.length; i++) {
            if(departments[i].department_id === answer.choice) {
                chosenDepartment = departments[i];
                break;
            };
        }
        // Insert new role in to the DB.
        let result = await connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        })
        // Print success message to the user.
        console.log(`${answer.title} role added successfully.\n`);
        // Present user input again
        showManagementOptions();

    } catch (err) {
        console.log(err);
    };
}

// Update the role of the selected employee.
const updateEmployee = async() => {
    try {
        // Get all employees.
        let employees = await connection.query('SELECT * FROM employee');
        // Inquirer prompt to select the employee to make the update.
        let employeeSelection = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: employees.map((employeeName) => {
                    return {
                        name: employeeName.first_name + " " + employeeName.last_name,
                        value: employeeName.id
                    }
                }),
                message: 'Please choose an employee to update.'
            }
        ]);
        // Get all roles.
        let roles = await connection.query("SELECT * FROM role");
        // Inquirer prompt to select the new role of the employee.
        let roleSelection = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map((roleName) => {
                    return {
                        name: roleName.title,
                        value: roleName.id
                    }
                }),
                message: 'Please select the role to update the employee with.'
            }
        ]);
        // Update the employees new role in the DB.
        let result = await connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleSelection.role }, { id: employeeSelection.employee }]);
        // Print success message to the user.
        console.log(`The role was successfully updated.\n`);
        // Present user input again
        showManagementOptions();
    } catch (err) {
        console.log(err);
    };
}

// Print application title to the console using figlet.
figlet('EMPLOYEE TRACKER', function(err, data) {
    if (err) {
        console.dir(err);
        return;
    }
    console.log(data);
});