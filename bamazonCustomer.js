const inquirer = require("inquirer");
const colors = require("colors");
const Table = require("cli-table");
const mysql = require("mysql");
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
  console.log("Connected as id " + connection.threadId);
  runBamazon();
});

function runBamazon() {
  console.log(
    "Welcome to Bamazon! Take a look at our items for sale!".bold.green
  );
  console.log(
    "------------------------------------------------------------".brightBlue
  );
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
          qty: element.stock_quantity,
          sales: element.product_sales
        };
        storeArray.push(storeObject);
      });
      printTable(result, fields);
      wantToBuy();
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
  table.push([fields[0].name, fields[1].name, fields[3].name]);
  result.forEach(element => {
    table.push([element.item_id, element.product_name, "$" + element.price]);
  });
  console.log(colors.brightWhite(table.toString()));
}

function wantToBuy() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Would you like to purchase one of these items?",
        name: "wantToBuy"
      }
    ])
    .then(function(response) {
      if (response.wantToBuy === true) {
        askInput();
      } else if (response.wantToBuy === false) {
        console.log(
          "Sorry we didn't have what you were looking for. See you soon!".italic
            .brightRed
        );
        connection.end();
      }
    });
}

function askInput() {
  inquirer
    .prompt([
      {
        type: "number",
        message:
          "What is the item_id number of the product you would like to purchase?",
        name: "userItemChoice",
        validate: function(value) {
          let reg = /^\d+$/;
          return reg.test(value) || "Must be a number.";
        }
      },
      {
        type: "number",
        message: "How many would you like to purchase?",
        name: "userDesiredQty",
        validate: function(value) {
          let reg = /^\d+$/;
          return reg.test(value) || "Must be a number.";
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "SELECT * FROM products WHERE ?",
        {
          item_id: answer.userItemChoice
        },
        function(error, response) {
          if (error) throw error;
          if (response[0].stock_quantity >= answer.userDesiredQty) {
            console.log("Confirming Purchase!");
            let newQty = response[0].stock_quantity - answer.userDesiredQty;
            let totalCost = answer.userDesiredQty * response[0].price;
            updateQuantity(answer.userItemChoice, newQty);
            updateSales(answer.userItemChoice, totalCost);
            console.log(colors.brightYellow("Total Cost: $" + totalCost));
            console.log("Thank you for your purchase!".brightMagenta);
            setTimeout(function() {
              runBamazon();
            }, 5 * 1000);
          } else {
            console.log("Insufficient Quantity.");
            askInput();
          }
        }
      );
    });
}

function updateSales(userItemChoice, totalCost) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        product_sales: totalCost
      },
      {
        item_id: userItemChoice
      }
    ],
    function(err) {
      if (err) throw err;
    }
  );
}

function updateQuantity(userItemChoice, newQty) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQty
      },
      {
        item_id: userItemChoice
      }
    ],
    function(err) {
      if (err) throw err;
    }
  );
}
