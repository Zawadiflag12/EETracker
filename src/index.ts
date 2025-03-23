import inquirer from 'inquirer';
import { Pool } from 'pg';
import config from './config';

const pool = new Pool(config);

async function mainMenu() {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Exit'
            ]
        }
    ]);

    switch (choice) {
        case 'View All Employees':
            await viewEmployees();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'View All Roles':
            await viewRoles();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'View All Departments':
            await viewDepartments();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }
   async function updateEmployeeRole() {
      const employees = await pool.query('SELECT * FROM employees');
      const roles = await pool.query('SELECT * FROM roles');

      const { employeeId, newRoleId } = await inquirer.prompt([
         {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employees.rows.map(e => ({ name: `${e.first_name} ${e.last_name}`, value: e.id }))
         },
         {
            type: 'list',
            name: 'newRoleId',
            message: 'Select the new role:',
            choices: roles.rows.map(r => ({ name: r.title, value: r.id }))
         }
      ]);

      await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
      console.log('Employee role updated!');
   }
    
    async function viewRoles() {
        const result = await pool.query('SELECT * FROM roles');
        console.table(result.rows);
    }
    
    async function addRole() {
        const { title, salary, departmentId } = await inquirer.prompt([
            { type: 'input', name: 'title', message: 'Role title:' },
            { type: 'input', name: 'salary', message: 'Salary:' },
            { type: 'input', name: 'departmentId', message: 'Department ID:' }
        ]);
        await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
        console.log('Role added!');
    }
    
    async function viewDepartments() {
        const result = await pool.query('SELECT * FROM departments');
        console.table(result.rows);
    }
    
    async function addDepartment() {
        const { name } = await inquirer.prompt([
            { type: 'input', name: 'name', message: 'Department name:' }
        ]);
        await pool.query('INSERT INTO departments (name) VALUES ($1)', [name]);
        console.log('Department added!');
    }
    
    mainMenu();
}

async function viewEmployees() {
    const result = await pool.query('SELECT * FROM employees');
    console.table(result.rows);
}

async function addEmployee() {
    const roles = await pool.query('SELECT * FROM roles');
    const employee = await pool.query('SELECT * FROM employees');
    const { firstName, lastName, roleId, managerId} = await inquirer.prompt([
        { type: 'input', name: 'firstName', message: 'First name:' },
        { type: 'input', name: 'lastName', message: 'Last name:' },
        { type: 'list', name: 'roleId', message: 'Role:', choices: roles.rows.map(r => ({ name: r.title, value: r.id })) },
        { type: 'list', name:'managerId', message: 'who is your manager?', choices: employee.rows.map(e => ({name: e.first_name + ' ' + e.last_name, value: e.id}))},
    ]);
    await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
    console.log('Employee added!');
}

mainMenu();
