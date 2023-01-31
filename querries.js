const { AsyncLocalStorage } = require('async_hooks');
const fs = require('fs');
const path = require('path');
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api',
    password: '0321',
    port: 5000,
})
const ws = fs.createWriteStream(path.resolve(__dirname, './test.txt'),{flags:'w'});
const getEmployees = async (req, res) => {
    pool.query('SELECT * FROM employee ORDER BY id_employee', async (error, results) => {
        if (error) {
            console.log(error)
            await res.status(404).json("Error please check console logs")
        }
        else {
            ws.write(JSON.stringify(results.rows))
            await res.status(200).json(results.rows);
            
        }
    })
   
}

const getEmployeeByID = async (req, res) => {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) {
        pool.query('SELECT * FROM employee WHERE employee.id_employee=$1', [id],async (error, results) => {
            if (error) {
                console.log(error);
                await res.status(404).json("Error Occurred")
            }
            else if (results.rowCount === 0) {
                await res.status(404).json("Record not found")
            }
            else {
                await res.status(200).json(results.rows);
            }
        })
    }
    else {
        await res.status(404).json('Please provide a valid id')
    }
}

const insertEmployee =async (req, res) => {
    const {
        name_employee = undefined,
        age_employee = undefined,
        stack_employee = undefined
    } = req.body
    if (name_employee === undefined || age_employee === undefined || name_employee === undefined || stack_employee === undefined || isNaN(age_employee)) {
        await res.status(404).json('Please check parameters');
    }
    else {
        pool.query('INSERT INTO employee(name_employee,age_employee,stack_employee) VALUES ($1, $2,$3)', [name_employee, age_employee, stack_employee], async(error, results) => {
            if (error) {
                console.log(error);
                res.status(404).json("Error Occured")
            }
            else{
            await res.status(201).json('User added');
            }
        })

    }
}

const updateEmployee = async(req, res) => {
    const {
        id_employee = undefined,
        name_employee = undefined,
        age_employee = undefined,
        stack_employee = undefined
    } = req.body
    isFound = true;
    pool.query('SELECT * FROM employee WHERE id_employee=$1', [id_employee], (error, results) => {
        if (results.rowCount === 0) {
            isFound = false
        }
        console.log(results)
    })


    if (name_employee === undefined || age_employee === undefined || name_employee === undefined || stack_employee === undefined || id_employee === undefined || isNaN(age_employee)) {
        return await res.status(404).json('Please check parameters');
    }
    else if (isFound === false) {
        return await res.status(404).json('Record not found')
    }
    else {
        pool.query('UPDATE employee SET name_employee=$1,age_employee=$2,stack_employee=$3 WHERE id_employee=$4', [name_employee, age_employee, stack_employee, id_employee],async (error, results) => {
            if (error) {
                console.log(error);
                return await res.status(404).json('Error Occurred');
            }
            else if (results.rowCount === 0) {
                return await res.status(404).json('record not found');
            }
            else
                return await res.status(201).send('User Updated');
        })

    }
}
const deleteUser = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('DELETE FROM employee WHERE id_employee = $1', [id], async(error, results) => {
        if (error) {
            console.log(error);
            await res.status(404).json('Error has occurred')
        }
        else if (results.rowCount === 0) {
            await res.status(404).json('Record not found')
        }
        else
            await res.status(200).send(`User deleted with ID: ${id}`)

    })

}

module.exports = {
    getEmployees,
    getEmployeeByID,
    insertEmployee,
    updateEmployee,
    deleteUser
}