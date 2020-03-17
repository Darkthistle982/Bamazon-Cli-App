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

connection.connect(function(error) {
  if (error) throw error;
  console.log(colors.yellow("Connected as id " + connection.threadId));
  runBamazonSupervisor();
});

function runBamazonSupervisor() {
  console.log(colors.brightGreen("Welcome to bamazon Supervisor view!"));
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please choose which action you would like to perform.",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "Exit"
        ],
        name: "action"
      }
    ])
    .then(function(resp) {
      switch (resp.action) {
        case "View Product Sales by Department":
        //   viewProductSales();
          console.log("View Product Sales by Department selected".zebra)
          break;
        case "Create New Department":
        //   createNewDepartment();
          console.log("Create New Department selected".zebra)
          break;
        case "Exit":
          console.log(colors.bold.brightYellow("Thanks! See you next time!"));
          connection.end();
      }
    });
}

function viewProductSales() {
    connection.query(
        "SELECT product_sales FROM bamazon.products"
    )
}