const inquirer = require('inquirer');
const mysql = require('mysql');
const colors = require('colors');

const connection = mysql.createConnection({
    host: 'loclhost',
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

