const inquirer = require("inquirer");
const colors = require("colors");
const Table = require("cli-table");
const mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
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
    "---------------------------------------------------------".brightBlue
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
          qty: element.stock_quantity
        };
        storeArray.push(storeObject);
      });
      printTable(result, fields);
    //   askInput();
    }
  );
}

function printTable(result, fields) {
  let table = new Table({
    chars: {
      top: "═", "top-mid": "╤", "top-left": "╔", "top-right": "╗",
      bottom: "═", "bottom-mid": "╧", "bottom-left": "╚", "bottom-right": "╝",
      left: "║", "left-mid": "╟", mid: "─", "mid-mid": "┼",
      right: "║", "right-mid": "╢",
      middle: "│"
    }
  });

  table.push([fields[0].name, fields[1].name, fields[3].name]);

  result.forEach(element => {
    table.push([element.item_id, element.product_name, element.price]);
  });

  console.log(table.toString());
}

function askInput() {
    
}