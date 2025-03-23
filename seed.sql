INSERT INTO departments (name) VALUES
('Engineering'),
('Marketing'),
('Sales');

INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 80000, 1),
('Marketing Manager', 75000, 2),
('Sales Associate', 50000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Johnson', 1, NULL),
('Bob', 'Smith', 2, NULL),
('Charlie', 'Brown', 3, NULL);

