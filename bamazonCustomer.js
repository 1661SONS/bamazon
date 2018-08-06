// requiring dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table');

// establishing database connection
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect( function(err) {
    if (err) throw err;
    console.log('is connected to id ' + connection.threadId + '\n');
});

// pretty print all items for sale in products table
connection.query('SELECT * FROM products', function(err, response) {
    if (err) throw err;
    // need to pretty print this table
    for (var i = 0; i < response.length; i++) {
        var item = response[i];

        var table = new Table ({
            head: ['ID', 'Product', 'Price', 'Stock'],
            colWidths: [5, 30, 10, 10]
        });
        table.push(
            [item.item_id, item.product_name, '$ '.green+item.price, item.stock_quantity]
        );
        console.log(table.toString());
    };
    connection.end();
});

// using inquirer - prompt user for product id
    // they gleen this from the product table
// then prompt user for quantity of that item to buy
    // 

// display a sort of cart in another table?
    // calculate total for selected item(s)
    // ask/confirm 'continue shopping?'
        // no goes to checkout
        // yes restarts prompts
        // cart should update with added products

// inquirer.prompt([
//     {
//         name: 'productID',
//         message: 'type the product ID of the item you want to buy',
//         type: 'input'
//     }, {
//         name: 'quantity',
//         message:'type the quantity you want to buy',
//         type: 'input'
//     }
// ]).then( function(body) {

// })

