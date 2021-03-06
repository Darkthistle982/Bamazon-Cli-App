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
  runBamazonManager();
});

function runBamazonManager() {
  console.log(
    colors.brightGreen(`
Welcome to Bamazon Manager View.
`)
  );
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please choose which action you would like to perform:",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
        ],
        name: "action"
      }
    ])
    .then(function(resp) {
      switch (resp.action) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addToInventory();
          break;
        case "Add New Product":
          addNewProduct();
          break;
        case "Exit":
          console.log(colors.bold.brightYellow("Thanks! See you next time!"));
          connection.end();
      }
    });
}

function viewProducts() {
  connection.query(
    "SELECT item_id, product_name, department_name, price, stock_quantity FROM bamazon.products;",
    function(error, result, fields) {
      if (error) throw error;
      let storeData = result;
      storeArray = [];
      storeData.forEach(element => {
        let storeObject = {
          id: element.item_id,
          name: element.product_name,
          deptName: element.department_name,
          price: element.price,
          qty: element.stock_quantity
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
  table.push([fields[0].name, fields[1].name, fields[3].name, fields[4].name]);
  result.forEach(element => {
    table.push([
      element.item_id,
      element.product_name,
      "$" + element.price,
      element.stock_quantity
    ]);
  });
  console.log(colors.brightWhite(table.toString()));
  runBamazonManager();
}

function viewLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(
    error,
    result
  ) {
    if (error) throw error;
    if (result !== []) {
      result.forEach(element => {
        console.log(
          colors.brightCyan(`
          Item ID: ${element.item_id}
          Product: ${element.product_name}
          Quantity: ${element.stock_quantity}
          `)
        );
      });
      runBamazonManager();
    }
    else {
      console.log("No Inventory items are currently low in stock!".bold.brightRed);
      runBamazonManager();
    }
  });
}

function addToInventory() {
  inquirer
    .prompt([
      {
        type: "number",
        message:
          "Enter the Item ID you would like to add to current inventory.",
        name: "item_id",
        validate: function(value) {
          let reg = /^\d+$/;
          return reg.test(value) || "Must be a number.";
        }
      },
      {
        type: "number",
        message:
          "Please enter the number of items you would like added to the inventory.",
        name: "qtyToAdd",
        validate: function(value) {
          let reg = /^\d+$/;
          return reg.test(value) || "Must be a number.";
        }
      }
    ])
    .then(function(response) {
      console.log("Updating Inventory.".bold.brightGreen);
      connection.query(
        `UPDATE products SET stock_quantity = stock_quantity + ${response.qtyToAdd} WHERE item_id = ${response.item_id}`,
        function(error, result) {
          if (error) throw error;
          console.log(
            colors.bold.brightYellow("Item added to Inventory Successfully")
          );
          runBamazonManager();
        }
      );
    });
}


function addNewProduct () {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the Name of the product to be added to the store?",
      name: "product_name"
    },
    {
      type: "input",
      message: "What department would this product belong to?",
      name: "department_name"
    },
    {
      type: "number",
      message: "What is the single item price of this product?",
      name: "price",
      validate: function(value) {
        let reg = /^\d+$/;
        return reg.test(value) || "Must be a number.";
      }
    },
    {
      type: "number",
      message: "How many of these items are you adding to the inventory?",
      name: "stock_quantity",
      validate: function(value) {
        let reg = /^\d+$/;
        return reg.test(value) || "Must be a number.";
      }
    }
  ]).then(function(answer) {
    console.log("Updating Inventory".brightCyan);
    connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${answer.product_name}", "${answer.department_name}", ${answer.price}, ${answer.stock_quantity})`,
    function(error) {
      if (error) throw error;
      console.log(colors.bold.brightCyan(answer.product_name + " successfully added to inventory!"));
      runBamazonManager();
    })
  })
}