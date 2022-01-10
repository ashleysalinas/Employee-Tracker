DROP DATABASE IF EXISTS employees_db;

CREATE database employees_db;

USE employees_db;

CREATE TABLE department (
    id INT PRIMARY NOT NULL,
    name VARCHAR(30) NOT NULL
)

CREATE TABLE role (
    id INT PRIMARY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2).
    department_id INT,
)

CREATE TABLE employee (
    id INT PRIMARY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
)

SELECT * FROM department;
SELECT * FROM role;
SELECT * from employee;
