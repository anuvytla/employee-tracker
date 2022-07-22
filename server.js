const mysql = require('mysql2');
const inquirer = require('inquirer');
const util = require('util');
const figlet = require('figlet');

var connection = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password : 'password',
    database : 'employee_db'
});

connection.connect(err => {
    if (err) throw err;
    showManagementOptions();
});

connection.query = util.promisify(connection.query);

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

const viewAllEmployees = async() => {
    try {
        let query = 'SELECT * FROM employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            showManagementOptions();
        });
    } catch (err) {
        console.log(err);
    };
}

const viewAllDepartments = async() => {
    try {
        let query ='SELECT * FROM department';
        connection.query(query, function(err, res){
            if (err) throw err;
            let departmentArray =[];
            res.forEach(department => departmentArray.push(department));
            console.table(departmentArray);
            showManagementOptions();
        });
    } catch (err) {
        console.log(err);
    };
}

const viewAllRoles = async() => {
    try {
        let query = 'SELECT * FROM role';
        connection.query(query, function (err,res) {
            if (err) throw err;
            let roleArray = [];
            res.forEach(role => roleArray.push(role));
            console.table(roleArray);
            showManagementOptions();
        });
    } catch (err) {
        console.log(err);
    };
}

const addEmployees = async() => {
    try {
        let roles = await connection.query("SELECT * FROM role");

        let managers = await connection.query("SELECT * FROM employee");

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

        let result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });

        console.log(`${answer.firstName} ${answer.lastName} added successfully.\n`);
        showManagementOptions();

    } catch (err) {
        console.log(err);
    };
}

const addDepartments = async() => {
    try {
        let userinput = await inquirer.prompt([
            {
                name:'departmentName',
                type:'input',
                message: 'What is the name of th employees department?'

            }
        ]);
        let result = await connection.query("INSERT INTO department SET ?", {
            department_name: userinput.departmentName
        });
        console.log(`${userinput.departmentName} added successfully to departments.\n`);
        showManagementOptions();
    }catch (err) {
        console.log(err);
    };
}

const addRoles = async() => {
    try {
        let departments = await connection.query('SELECT * FROM department');
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
            };
        }
        let result = await connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        })

        console.log(`${answer.title} role added successfully.\n`);
        showManagementOptions();

    } catch (err) {
        console.log(err);
    };
}

const updateEmployee = async() => {
    try {
        let employees = await connection.query('SELECT * FROM employee');
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
        let roles = await connection.query("SELECT * FROM role");
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
        let result = await connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleSelection.role }, { id: employeeSelection.employee }]);

        console.log(`The role was successfully updated.\n`);
        showManagementOptions();
    } catch (err) {
        console.log(err);
    };
}

figlet('EMPLOYEE TRACKER', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});