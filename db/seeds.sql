INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Arya', 'stark', 1, null),
       ('Jon', 'Snow', 5, 2),
       ('Jaime', 'Lannister', 2, 1),
       ('Tyrion', 'Lannister', 4, 1),
       ('Emlia', 'Clark', 6, null),
       ('Eleven', 'Mike', 3, 1),
       ('Mike', 'Schrute', 2, 1);


INSERT INTO department (department_name)
VALUES ('Management'),
       ('Reception'),
       ('Sales'),
       ('Human Resources'),
       ('Accounting');


INSERT INTO role (title, salary, department_id)
VALUES ('General Manager', 120000, 1),
       ('Salesman', 80000, 2),
       ('Accountant', 90000, 4),
       ('Receptionist', 40000, 3),
       ('Human Resource', 75000, 5),
       ('CEO', 250000, null);
