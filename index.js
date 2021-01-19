const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "HotTo$$y",
  database: "greatBayDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  createProduct();
});

function postAuctionItem() {
  inquirer
    .prompt([
      {
        name: "name",
        message: "item name",
        type: "input"
      },
      {
        name: "bid",
        message: "bid price",
        type: "input"
      }
    ])
    .them(({ name, bid }) => {
      connection.query(
        `INSERT INTO items (name, bid)
            VALUES ("football", 10);`,
        (err, data) => {
          if (err) throw err;
          console.log(data);
          init();
        }
      );
    });
}

function init() {
  //prompts
}

function exit() {
  connection.end();
}
// 1 hard code queries in mysql workbench
// 2-bring queries in and add into functions
// 3-test each function individually
// 4-incorporate inquirer prompt to call these functions
// 5-add additional inquirer prompts to take user input
// 6-modify the sql queries to be dynamic
