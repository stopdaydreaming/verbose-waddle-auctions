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
  database: "greatBayDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id: ${connection.threadId}`);
  init();
});

function bidOnItem() {
  connection.query("SELECT * FROM items", (err, data) => {
    if (err) throw err;
    console.log(data);
    const arrayOfItems = data.map((item) => {
      return { name: item.name, value: item.id };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "selection",
          message: "Which item would you like to bid on?",
          choices: arrayOfItems,
        },
        {
          type: "input",
          name: "newBid",
          message: "How much would you like to bid?",
        },
      ])
      .then(({ newBid, selection }) => {
        console.log(selection);
        // console.log(newBid);
        // 1. See if the user's bid is higher than the current bid.
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === selection) {
            console.log("Current Bid: ", data[i].bid);
            console.log("Your Bid: ", newBid);
            if (data[i].bid < newBid) {
              // TODO: Update the item.
              console.log("Your bid is good!");
              connection.query(
                `UPDATE items SET bid = ? WHERE id = ?;`,
                [newBid, selection],
                (err, data) => {
                  if (err) throw err;
                  console.log("Your bid was successfully registered!");
                  init();
                }
              );
            } else {
              // TODO: Alert the user that their bid is not sufficient.
              console.log("Your bid is too low!");
              init();
            }
            break;
          }
        }
      });
  });
  // 1. Retrieve a list of items from the database via SQL query
  // 2. Inject the list of items into inquirer as options
  // 3. Call inquirer.prompt
  // 4. Accept the user's input
  // 5. ???
}

function postItemForAuction() {
  inquirer
    .prompt([
      {
        name: "name",
        message: "What is the item's name?",
        type: "input",
      },
      {
        name: "bid",
        message: "What is the item's starting bid?",
        type: "input",
      },
    ])
    .then(({ name, bid }) => {
      connection.query(
        `INSERT INTO items (name, bid)
        VALUES (?, ?);`,
        [name, bid],
        (err, data) => {
          if (err) throw err;
          console.log(data);
          init();
        }
      );
    });
}

function init() {
  inquirer
    .prompt([
      {
        name: "action",
        message: "What would you like to do?",
        type: "list",
        choices: ["ADD AN ITEM FOR AUCTION", "BID ON ITEM", "EXIT"],
      },
    ])
    .then(({ action }) => {
      if (action === "ADD AN ITEM FOR AUCTION") {
        postItemForAuction();
      } else if (action === "BID ON ITEM") {
        bidOnItem();
      } else {
        exit();
      }
    });
}

function exit() {
  connection.end();
}
// 1. Hard code queries in MySQL Workbench
// 2. Bring queries in and add into functions.
// 3. Test each function individually.
// 4. Incorporate inquirer.prompt to call these functions.
// 5. Add additional inquirer prompts to take in user input.
// 6. Modify the SQL queries to be dynamic.
