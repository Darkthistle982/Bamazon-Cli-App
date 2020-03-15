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
          // viewProducts();
          console.log("View Products selected.");
          break;
        case "View Low Inventory":
          // viewLowInventory();
          console.log("View Low Inventory selected");
          break;
        case "Add to Inventory":
          // addToInventory();
          console.log("Add to Inventory Selected");
          break;
        case "Add New Product":
          // addNewProduct();
          console.log("Add new Product selected");
          break;
        case "Exit":
          console.log(colors.bold.brightYellow("Thanks! See you next time!"));
          connection.end();
      }
    });
};

function viewProducts() {

}
