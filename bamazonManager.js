const inquirer = require("inquirer");
const mysql = require("mysql");
const colors = require("colors");

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
  runBamazonManager();
});

function runBamazonManager() {
  console.log(colors.brightGreen(`
Welcome to Bamazon Manager View.
`));  
  inquirer.prompt([
      {
        type: "list",
        message: "Please choose which action you would like to perform:",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
        name: "action"
      }
    ]).then(function(resp) {
        switch (resp.action) {
            case 'View Products for Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                viewLowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();
                break;
            case 'Add New Product':
                addNewProduct();
                break;
            case 'Exit':
                console.log(colors.bold.brightYellow("Thanks! See you next time!"));
                connection.end();
        }
    });
}
