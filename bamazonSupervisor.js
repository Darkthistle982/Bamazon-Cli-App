const inquirer = require("inquirer");
const mysql = require("mysql");
const colors = require("colors");
const Table = require("cli-table");
const dotenv = require("dotenv").config();

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
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
          viewProductSales();
          break;
        case "Create New Department":
          createNewDepartment();
          break;
        case "Exit":
          console.log(colors.bold.brightYellow("Thanks! See you next time!"));
          connection.end();
      }
    });
}

function viewProductSales() {
  connection.query(
    "SELECT d.*, SUM(p.product_sales) AS product_sales, (SUM(p.product_sales) - d.over_head_costs) AS total_profit FROM departments d LEFT JOIN products p ON d.department_name = p.department_name GROUP BY d.department_id;",
    function(error, result, fields) {
      if (error) throw error;
      let storeData = result;
      storeArray = [];
      storeData.forEach(element => {
        let storeObject = {
          id: element.department_id,
          deptName: element.department_name,
          overHead: element.over_head_costs,
          sales: element.product_sales,
          profit: element.total_profit
        };
        storeArray.push(storeObject);
      });
      printTable(result, fields);
    }
  );
}

function printTable(result, fields) {
  let table = new Table({
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│"
    },
    style: { "padding-left": 3, "padding-right": 2 }
  });
  table.push([
    fields[0].name,
    fields[1].name,
    fields[2].name,
    fields[3].name,
    fields[4].name
  ]);
  result.forEach(element => {
    table.push([
      element.department_id,
      element.department_name,
      "$" + element.over_head_costs,
      "$" + element.product_sales,
      "$" + element.total_profit
    ]);
  });
  console.log(colors.brightWhite(table.toString()));
  runBamazonSupervisor();
}

function createNewDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the name of the new department.",
        name: "depName"
      },
      {
        type: "number",
        message: "Please enter the over head costs for this department.",
        name: "overHeadCost",
        validate: function (value) {
            let reg = /^\d+$/;
            return reg.test(value) || "Over Head Cost should be a number.";
        }
      }
    ])
    .then(function(answer) {
      console.log("Updating Departments".brightCyan);
      connection.query(
        `INSERT INTO departments (department_name, over_head_costs) VALUES ("${answer.deptName}", ${answer.overHeadCost})`,
        function(error) {
          if (error) throw error;
          console.log(
            colors.bold.brightCyan(answer.depName + " added to the database.")
          );
          runBamazonSupervisor();
        }
      );
    });
}