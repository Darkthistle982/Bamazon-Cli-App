const inquirer = require("inquirer");
const mysql = require("mysql");
const colors = require("colors");
const Table = require("cli-table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
  });