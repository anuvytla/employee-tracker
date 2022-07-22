const mysql = require('mysql2');
const inquirer = require('inquirer');

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
                viewAllDepartment();
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

}

const viewAllDepartment = async() => {

}

const viewAllRoles = async() => {

}

const addEmployees = async() => {

}

const addDepartments = async() => {

}

const addRoles = async() => {

}

const updateEmployee = async() => {

}